import drawGrid from './drawGrid'
import drawTri from './drawTri'
import drawCuboid from './drawCuboid'
import { default as model } from '../../../common/utils/computeTMatrixFromTransforms'

export default function Encl (regl, params) {
  const gridSize = [220, 200]
  const mGridSize = [21.3, 22]
  const _drawGrid = drawGrid(regl, { size: mGridSize, ticks: 4 })
  const _drawInfiniGrid = drawGrid(regl, {size: gridSize, ticks: 1})
  const gridOffset = model({pos: [0, 0, 0.001]})

  const triSize = {width: 5, height: 2}
  const _drawTri = drawTri(regl, {width: triSize.width, height: triSize.height})
  const triMatrix = model({ pos: [-triSize.width / 2, mGridSize[0], 0.001] })

  const containerSize = [mGridSize[1], mGridSize[0], 35]
  const _drawCuboid = drawCuboid(regl, {size: containerSize})
  const containerCuboidMatrix = model({ pos: [0, 0, containerSize[2]] })

  return ({view, camera}) => {
    _drawGrid({view, camera, color: [0, 0, 0, 1]})
    _drawInfiniGrid({view, camera, color: [0, 0, 0, 0.5], model: gridOffset})

    _drawTri({view, camera, color: [0, 0, 0, 0.5], model: triMatrix})
    _drawCuboid({view, camera, color: [0, 0, 0.0, 0.2], model: containerCuboidMatrix})
  }
}