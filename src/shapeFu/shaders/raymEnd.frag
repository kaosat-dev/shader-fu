// get distance in the world
float dist_field( vec3 pos ) {
  if(showAxes){
    float axes = sdBox(pos,vec3(.02,.02,1000.));//Z
    axes= opU(axes, sdBox(pos,vec3(.02,10000,.02)));//Y
    axes= opU(axes, sdBox(pos,vec3(10000,.02,.02)));//X
    axes= opU(axes, sdBox(pos+vec3(10,-5,0),vec3(0.02,10.,0.02)));//notch at x+10
    axes= opU(axes, sdBox(pos+vec3(-5,10,0),vec3(10,0.02,0.02)));//notch at y+10
    axes= opU(axes, sdBox(pos+vec3(0,-5,10),vec3(.02,10,0.02)));//notch at z+10*/
    return opU(axes , root(pos));
  }
  return root(pos);



	/*vec3 offset = vec3(0,0,0);
	// object 0 : sphere
	float d0 = dist_sphere( pos+offset, 2.7 );

	// object 1 : cube
	float d1 = dist_box( pos+offset, vec3( 2.0 ) );

	// union     : min( d0,  d1 )
	// intersect : max( d0,  d1 )
	// subtract  : max( d1, -d0 )
	return opSubtract(d0, d1);*/
}

// phong shading
vec3 shading( vec3 v, vec3 n, vec3 eye ) {
	float shininess = 200.0;

	vec3 ev = normalize( v - eye );
	vec3 ref_ev = reflect( ev, n );

  vec3 light = vec3(0.2); // ambient ??
  for (int i = 0; i < lightsNb; ++i) {
     vec3 lightDir = normalize(lights[i].position - v);
     float diffuse = max(0.0, dot(lightDir, n));
		 float specular = max( 0.0, dot( lightDir, ref_ev ) );
		 specular = pow( specular, shininess );

     light += lights[i].color * ( diffuse + specular )* lights[i].intensity; //diffuse * lights[i].color * lights[i].intensity;
  }
	return light;
}

// get gradient in the world
vec3 gradient( vec3 pos ) {
 	vec3 dx = vec3( uRM_grad_step, 0.0, 0.0 );
	vec3 dy = vec3( 0.0, uRM_grad_step, 0.0 );
	vec3 dz = vec3( 0.0, 0.0, uRM_grad_step );
	return normalize (
		vec3(
			dist_field( pos + dx ) - dist_field( pos - dx ),
			dist_field( pos + dy ) - dist_field( pos - dy ),
			dist_field( pos + dz ) - dist_field( pos - dz )
		)
	);
}

// ray marching
float ray_marching( vec3 origin, vec3 dir, float start, float end ) {
	float depth = start;
	for ( int i = 0; i < MAX_ITERATIONS; i++ ) {
		//if(i < uRM_maxIterations){
			float dist = dist_field( origin + dir * depth );
			if ( dist < uRM_stop_threshold ) {
				return depth;
			}
			depth += dist;
			if ( depth >= end) {
				return end;
			}
		//}

	}
	return end;
}

// get ray direction
vec3 ray_dir( float fov, vec2 size, vec2 pos ) {
	vec2 xy = pos - size * 0.5;

	float cot_half_fov = tan( ( 90.0 - fov * 0.5 ) * DEG_TO_RAD );
	float z = size.y * 0.5 * cot_half_fov;

	return normalize( vec3( xy, -z ) );
}

// camera rotation : pitch, yaw
mat3 rotationXY( vec2 angle ) {
	vec2 c = cos( angle );
	vec2 s = sin( angle );

	return mat3(
		c.y      ,  0.0, -s.y,
		s.y * s.x,  c.x,  c.y * s.x,
		s.y * c.x, -s.x,  c.y * c.x
	);
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
	// default ray dir
	vec3 dir = ray_dir( 45.0, iResolution.xy, fragCoord.xy );

	// default ray origin
	vec3 eye = vec3( 0.0, 0.0, 10.0 );

	// rotate camera
	//mat3 rot = rotationXY( vec2( iGlobalTime ) );//
  mat3 rot = mat3(view);
	dir = rot * dir;
	eye = rot * eye * 5.;

	// ray marching
	float depth = ray_marching( eye, dir, 0.0, uRM_clip_far );
	if ( depth >= uRM_clip_far ) {
		fragColor = bgColor;
        return;
	}

	// shading
	vec3 pos = eye + dir * depth;
	vec3 n = gradient( pos );
	fragColor = vec4( shading( pos, n, eye ), 1.0 );
}

void main () {


	vec4 color = bgColor;
  mainImage( color, gl_FragCoord.xy );
  color.w = 1.0;
  gl_FragColor = color;
}
