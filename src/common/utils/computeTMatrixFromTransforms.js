import mat4 from 'gl-mat4'

/*compute  object transformation matrix from transforms: costly : only do it when changes happened*/
export default function computeTMatrixFromTransforms ({pos, rot, sca}) {
  // create transform matrix
  /*let modelMat = mat4.identity([])
  mat4.translate(modelMat, modelMat, [pos[0], pos[2], pos[1]]) // z up
  mat4.rotateX(modelMat, modelMat, rot[0])
  mat4.rotateY(modelMat, modelMat, rot[2])
  mat4.rotateZ(modelMat, modelMat, rot[1])
  mat4.scale(modelMat, modelMat, [sca[0], sca[2], sca[1]])
  /*let modelMat = mat4.identity([])
  mat4.translate(modelMat, modelMat, pos)
  mat4.rotateX(modelMat, modelMat, rot[0])
  mat4.rotateY(modelMat, modelMat, rot[1])
  mat4.rotateZ(modelMat, modelMat, rot[2])
  mat4.scale(modelMat, modelMat, [sca[0], sca[1], sca[2]])*/
  let modelMat = mat4.identity([])
  mat4.translate(modelMat, modelMat, [pos[0], pos[2], pos[1]]) // z up
  mat4.rotateX(modelMat, modelMat, rot[0])
  mat4.rotateY(modelMat, modelMat, rot[2])
  mat4.rotateZ(modelMat, modelMat, rot[1])
  mat4.scale(modelMat, modelMat, [sca[0], sca[2], sca[1]])

  return modelMat
}
