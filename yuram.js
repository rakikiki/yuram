// TODO:
// 初期地形

// フィールドの高さと幅
const HEIGHT = 8
const WIDTH = 6
const TUMO_HEIGHT = 3
// ツモの向き(軸から見たもう一つのゆめぐもの向き)
const TUMO_LEFT = 0
const TUMO_UPPER = 1
const TUMO_RIGHT = 2
const TUMO_BOTTOM = 3
// 色
const COLOR_RED = 1
const COLOR_YELLOW = 2
const COLOR_GREEN = 3
const COLOR_BLUE = 4
const COLOR_NONE = 0 // 編集機能用
// 状態
// 0:何もない,  1:未確定のくも,  2:4個つながった,  3:5個以上つながった
const STATE_NONE = 0
const STATE_KUMO = 1
const STATE_BLOCK = 2
const STATE_GOMI = 3
// 図形の形状
const SHAPE_TYPE_I = 1
const SHAPE_TYPE_O = 2
const SHAPE_TYPE_L = 3
const SHAPE_TYPE_S = 4
const SHAPE_TYPE_T = 5
const SHAPE_GOMI = -1
// ツモを捨てた時の減点
const THROW_TUMO_SCORE = -250
// 役の点数
const yakuScore = {
  'connectShape3': 1,
  'connectShape4': 1.5,
  'connectShape5': 2,
  'connectShape6': 2.5,
  'connectShape7': 3,
  'connectShape8': 3.5,
  'connectShape9': 4,
  'connectColor3': 1.5,
  'connectColor4': 2.5,
  'connectColor5': 3.5,
  'connectColor6': 5,
  'allColor': 1,
  'allColor2': 2,
  'allColor3': 3,
  'allShape': 3,
  'allShape2': 5,
  'verticalStraight': 2,
  'horizontalStraight': 3,
  'square4': 2,
  'sameSquare4': 2.5,
  'square9': 4,
  'halfSpread': 1.5,
  'spread': 4,
}
// 役の名前
const yakuName = {
  'connectShape3': 'コネクトシェイプ3',
  'connectShape4': 'コネクトシェイプ4',
  'connectShape5': 'コネクトシェイプ5',
  'connectShape6': 'コネクトシェイプ6',
  'connectShape7': 'コネクトシェイプ7',
  'connectShape8': 'コネクトシェイプ8',
  'connectShape9': 'コネクトシェイプ9',
  'connectColor3': 'コネクトカラー3',
  'connectColor4': 'コネクトカラー4',
  'connectColor5': 'コネクトカラー5',
  'connectColor6': 'コネクトカラー6',
  'allColor': 'オールカラー',
  'allColor2': 'オールカラー2',
  'allColor3': 'オールカラー3',
  'allShape': 'オールシェイプ',
  'allShape2': 'オールシェイプ2',
  'verticalStraight': '縦ストレート',
  'horizontalStraight': '横ストレート',
  'square4': 'スクエア4',
  'sameSquare4': 'セイムスクエア4',
  'square9': 'スクエア9',
  'halfSpread': 'ハーフスプレッド',
  'spread': 'スプレッド',
}
// 乱数生成
const MAX_SEED = 20000
// ツモ最大何手目まで生成するか
const MAX_TUMO_NUM = 20000
// 編集：選択中のくも色
let currentEditKumo = null
// 成立している役のリスト
let yakuList = []
// 役の合計星数
let starPoint = 0
// スコアの合計減点
let minusScore = 0
// 前回のスコア
let lastScore = 0
// 前回の星数
let lastStarPoint = 0
// ツモの位置
// 軸ゆめぐもの横位置と色
// 横位置は0～5
let tumoJiku = []
// 軸じゃないほうのゆめぐもの方向と色
// 向き 1:右 2:下 3:左 4:上
// ゆめぐもの状態
let tumoPair = []
// ツモ配列
// [軸の色、軸じゃない方の色]
let tumoArray = []
// 現在のツモの位置
let currentTumoNo = 0
// 図形番号
let currentShapeNo = 0
// 作成済の図形リスト
// 4つのブロックの位置と、図形の形状
// {
//   'positions': [0,0],[0,1],[0,2],[0,3]
//   'shapeType': 1,
//   'color': 1,
//   'shapeNo': 1
// }
let shapeList = []

// ゴミの図形リスト（編集機能用）
// {
//   'positions: [...],
//   'color': 1
//   'shapeNo': 3,
// }
let gomiList = []
// フィールドの情報
// {
//   color: 1,
//   state: kumo,
//   shapeNo: 1 // 0:図形でない,  1以上:図形No.(作成順に1ずつ加算),  -1:5個以上の接続
//   shapeType: 1 // 1:I,  2:O,  3:L,  4:S,  5:T
// }
let field = []
for (let i = 0; i < HEIGHT; i++) {
  let arr = new Array()
  for (let j = 0; j < WIDTH; j++) {
    arr.push({
      'color': 0,
      'state': STATE_NONE,
      'shapeNo': 0,
      'shapeType': 0
    })
  }
  field.unshift(arr)
}

// ツモパターンを生成する
function createTumoPattern(pattern) {
  tumoArray = []
  const seed = Math.floor((Math.random() * MAX_SEED))
  const myRandom = customRandom(seed)
  if (pattern === 'normal' || pattern === 'yuna') {
    // 通常は全色25％ずつ
    // ユナちゃんのパターンは知らないので未実装
    for (let i = 0; i < MAX_TUMO_NUM; i++) {
      var jikuColor = Math.floor(myRandom() * 4) + 1
      var pairColor = Math.floor(myRandom() * 4) + 1

      tumoArray.push([jikuColor, pairColor])
    } 
  } else if (pattern === 'geela') {
    // 詳しく知らないがジーラは青が40％、他20％らしい
    for (let i = 0; i <MAX_TUMO_NUM; i++) {
      var r1 = myRandom()
      var r2 = myRandom()
      var jikuColor = 0
      if (r1 < 0.2) {
        jikuColor = COLOR_RED
      } else if (r1 < 0.4) {
        jikuColor = COLOR_YELLOW
      } else if (r1 < 0.6) {
        jikuColor = COLOR_GREEN
      } else {
        jikuColor = COLOR_BLUE
      }
      var pairColor = 0
      if (r2 < 0.2) {
        pairColor = COLOR_RED
      } else if (r2 < 0.4) {
        pairColor = COLOR_YELLOW
      } else if (r2 < 0.6) {
        pairColor = COLOR_GREEN
      } else {
        pairColor = COLOR_BLUE
      }
      tumoArray.push([jikuColor, pairColor])
    }
  }
}

// ツモ移動
function moveTumo(move) {
  if (move == "moveLeft") {
    if (tumoJiku[0] > 0 && !(tumoJiku[0] === 1 && tumoPair[0] === TUMO_LEFT)) {
      tumoJiku[0] -= 1
    }
  } else if (move == "moveRight") {
    if (tumoJiku[0] < (WIDTH -1) && !(tumoJiku[0] === (WIDTH - 2) && tumoPair[0] === TUMO_RIGHT)) {
      tumoJiku[0] += 1
    }
  } else if (move === "rotateLeft") {
    if (tumoJiku[0] === 0 && tumoPair[0] === TUMO_UPPER) {
      // 左端の処理
      tumoJiku[0] += 1
    } else if (tumoJiku[0] === (WIDTH - 1) && tumoPair[0] === TUMO_BOTTOM) {
      // 右端の処理
      tumoJiku[0] -= 1
    }
    if (--tumoPair[0] < TUMO_LEFT) {
      tumoPair[0] = TUMO_BOTTOM
    }
  } else if (move === "rotateRight") {
    if (tumoJiku[0] === 0 && tumoPair[0] === TUMO_BOTTOM) {
      // 左端の処理
      tumoJiku[0] += 1
     } else if (tumoJiku[0] === (WIDTH - 1) && tumoPair[0] === TUMO_UPPER) {
      // 右端の処理
      tumoJiku[0] -= 1
    }
    if (++tumoPair[0] > TUMO_BOTTOM) {
      tumoPair[0] = TUMO_LEFT
    }
  }
  showTumoField()
}

// ツモを落下させる
function fallTumo() {
  var pairRow = tumoJiku[0]
  if (tumoPair[0] === TUMO_LEFT) {
    pairRow -= 1
  } else if (tumoPair[0] === TUMO_RIGHT) {
    pairRow += 1
  }
  var jikuPos = []
  var pairPos = []
  if (tumoPair[0] === TUMO_BOTTOM) {
    // ペアくもが先
    pairPos = putKumo(pairRow, tumoPair[1])
    jikuPos = putKumo(tumoJiku[0], tumoJiku[1])
  } else {
    // 軸ぷよが先
    jikuPos = putKumo(tumoJiku[0], tumoJiku[1])
    pairPos = putKumo(pairRow, tumoPair[1])
  }
  if (!jikuPos) {
    minusScore += THROW_TUMO_SCORE
  }
  if (!pairPos) {
    minusScore += THROW_TUMO_SCORE
  }
  createShape(jikuPos, pairPos)
  updateDisp()
  getTumo()
}

// 指定列にくもを置く
function putKumo(position, color) {
  for (let i = 0; i < HEIGHT; i++) {
    if (field[i][position].state === 0) {
      field[i][position].color = color
      field[i][position].state = STATE_KUMO
      return [i, position]
    }
  }
  // 置けなかった＝画面外
  return null
}

// 図形作成判定
// ツモ2箇所を置いた座標
function createShape(cell1, cell2) {
  // フィールドに置いたくもが2個
  if (cell1 && cell2) {
    // ツモ2つが隣り合っていて、かつ同じ色なら1回で判定
    if ((cell1[0] === cell2[0] && (Math.abs(cell1[1] - cell2[1]) <= 1))
        || (cell1[1] === cell2[1]) && (Math.abs(cell1[0] - cell2[0]) <= 1)) {
      if (field[cell1[0]][cell1[1]].color === field[cell2[0]][cell2[1]].color) {
        createShape(cell1, null)
      } else {
        // 2つのくもは関連がないので、別々に判定する
        createShape(cell1, null)
        createShape(cell2, null)
      }
    } else {
      // 2つのくもは関連がないので、別々に判定する
      createShape(cell1, null)
      createShape(cell2, null)
    }
  } else if (!cell1 && !cell2) {
    // どちらもフィールド外に置かれているため何もしない
    return
  } else {
    if (!cell1 && cell2) {
      cell1 = cell2
    }
    var row = cell1[0]
    var col = cell1[1]

    // くもじゃない場合何もしない（編集機能用）
    if (field[row][col].state !== STATE_KUMO) {
      return
    }

    // 上、下、左、右の色を見て、同じ色ならそこからさらに色をたどる
    let visited = Array.from({ length: HEIGHT }, () => Array(WIDTH).fill(false));
    let results = []
    exploreAdjacentElements(visited, row, col, field[row][col].color, results)

    if (results.length === 4) {
      // 4つ繋がったら図形化する
      var newShapeNo = ++currentShapeNo
      var shapeType = identifyShape(results)
      shapeList.push({'positions':results, 'shapeType': shapeType, 'color':field[row][col].color, 'shapeNo': newShapeNo})
      for (let i = 0; i < results.length; i++) {
        field[results[i][0]][results[i][1]].state = STATE_BLOCK
        field[results[i][0]][results[i][1]].shapeNo = newShapeNo
        field[results[i][0]][results[i][1]].shapeType = shapeType
      }
    } else if (results.length > 4) {
      // 5つ以上繋がったらゴミ化する
      var newShapeNo = ++currentShapeNo
      for (let i = 0; i < results.length; i++) {
        field[results[i][0]][results[i][1]].state = STATE_GOMI
        field[results[i][0]][results[i][1]].shapeNo = newShapeNo
        field[results[i][0]][results[i][1]].shapeType = SHAPE_GOMI
      }
      gomiList.push({'positions':results, 'color':field[row][col].color, 'shapeNo':newShapeNo})
    }
  }
}

// 各図形のパターン
const patternI = [
  [[0,0], [0,1], [0,2], [0,3]],
  [[0,0], [1,0], [2,0], [3,0]]
]
const patternO = [
  [[0,0], [0,1], [1,0], [1,1]]
]
const patternS = [
  [[0,0], [0,1], [1,1], [1,2]],
  [[0,1], [1,1], [1,0], [2,0]],
  [[1,0], [1,1], [0,1], [0,2]],
  [[0,0], [1,0], [1,1], [2,1]]
]
const patternL = [
  [[1,0], [1,1], [1,2], [0,2]],
  [[0,0], [1,0], [2,0], [2,1]],
  [[0,0], [0,1], [0,2], [1,0]],
  [[0,0], [0,1], [1,1], [2,1]],
  [[0,0], [1,0], [1,1], [1,2]],
  [[0,0], [0,1], [1,0], [2,0]],
  [[0,0], [0,1], [0,2], [1,2]],
  [[0,1], [1,1], [2,1], [2,0]]
]
const patternT = [
  [[1,0], [1,1], [0,1], [1,2]],
  [[0,0], [1,0], [2,0], [1,1]],
  [[0,0], [0,1], [0,2], [1,1]],
  [[0,1], [1,0], [1,1], [2,1]]
]
const test = [
  [[0,0], [0,1], [1,0], [1,1]],
  [[1,1], [0,0], [0,1], [1,0]],
  [[0,0], [0,1], [1,1], [1,0]],
  [[0,1], [1,0], [0,0], [1,1]]
]

// 図形の形状判定
function identifyShape(positions) {
  let copiedPositions = structuredClone(positions)
  // 要素内の最小値を求めて、その値を各要素から減算する
  let minX = WIDTH
  let minY = HEIGHT
  for (let i = 0; i < copiedPositions.length; i++) {
    if (minX > copiedPositions[i][1]) {
      minX = copiedPositions[i][1]
    }
    if (minY > copiedPositions[i][0]) {
      minY = copiedPositions[i][0]
    }
  }
  for (let i = 0; i < positions.length; i++) {
    copiedPositions[i][0] = copiedPositions[i][0] - minY
    copiedPositions[i][1] = copiedPositions[i][1] - minX
  }
  if (isIncludeInPattern(copiedPositions, patternI)) {
    return SHAPE_TYPE_I
  } else if (isIncludeInPattern(copiedPositions, patternO)) {
    return SHAPE_TYPE_O
  } else if (isIncludeInPattern(copiedPositions, patternS)) {
    return SHAPE_TYPE_S
  } else if (isIncludeInPattern(copiedPositions, patternL)) {
    return SHAPE_TYPE_L
  } else if (isIncludeInPattern(copiedPositions, patternT)) {
    return SHAPE_TYPE_T
  }
  return SHAPE_GOMI
}

// 指定の座標がパターン内に含まれるか
function isIncludeInPattern(positions, patterns) {
  let jsonPositions = JSON.stringify(positions)
  for (const pattern of patterns) {
    let match = true
    for (let i = 0; i < pattern.length; i++) {
      if (!jsonPositions.includes(JSON.stringify(pattern[i]))) {
        match = false
        break
      }
    }
    if (match) {
      return true
    }
  }
  return false
}

function checkYaku() {
  let tmpYakuList = []
  // コネクトシェイプ・コネクトカラーは複数発動するのでリストで返却される
  let connectShape = checkConnectShape()
  if (connectShape && connectShape.length > 0) {
    for (var i in connectShape) {
      tmpYakuList.push(connectShape[i])
    }
  }
  let connectColor = checkConnectColor()
  if (connectColor && connectColor.length > 0) {
    for (var i in connectColor) {
      tmpYakuList.push(connectColor[i])
    }
  }
  // 上記以外は単一の役なので文字列で返却される
  let allColor = checkAllColor()
  if (allColor) {
    tmpYakuList.push(allColor)
  }
  let allShape = checkAllShape()
  if (allShape) {
    tmpYakuList.push(allShape)
  }
  let verticalStraight = checkVerticalStraight()
  if (verticalStraight) {
    tmpYakuList.push(verticalStraight)
  }
  let horizontalStraight = checkHorizontalStraight()
  if (horizontalStraight) {
    tmpYakuList.push(horizontalStraight)
  }
  let square4 = checkSquare4()
  if (square4) {
    tmpYakuList.push(square4)
  }
  let sameSquare4 = checkSameSquare4()
  if (sameSquare4) {
    tmpYakuList.push(sameSquare4)
  }
  let square9 = checkSquare9()
  if (square9) {
    tmpYakuList.push(square9)
  }
  let halfSpread = checkHalfSpread()
  if (halfSpread) {
    tmpYakuList.push(halfSpread)
  }
  let spread = checkSpread()
  if (spread) {
    tmpYakuList.push(spread)
  }
  return tmpYakuList
}

// 2つの図形の隣接チェック
function isAdjacentShape(shape1, shape2) {
  for (let i = 0; i < shape1.positions.length; i++) {
    const [x1, y1] = shape1.positions[i]
    for (let j = 0; j < shape2.positions.length; j++) {
      const [x2, y2] = shape2.positions[j]
      if ((x1 === x2 && Math.abs(y1 - y2) <= 1) || y1 === y2 && Math.abs(x1 - x2) <= 1) {
        return true
      }
    }
  }
  return false
}

// コネクトシェイプ判定
function checkConnectShape() {
  const shapeTypeCounts = {};

  shapeList.forEach((shape, index) => {
    const currentType = shape.shapeType;
    const connectedShapes = [];
    const stack = [index];
    const visited = new Set();

    while (stack.length > 0) {
      const currentIndex = stack.pop();

      if (!visited.has(currentIndex)) {
        visited.add(currentIndex);
        connectedShapes.push(currentIndex);

        const currentShape = shapeList[currentIndex];
        shapeList.forEach((otherShape, otherIndex) => {
          if (currentIndex !== otherIndex && currentShape.shapeType === otherShape.shapeType) {
            const isConnected = currentShape.positions.some(pos1 =>
              otherShape.positions.some(pos2 =>
                (Math.abs(pos1[0] - pos2[0]) <= 1 && pos1[1] === pos2[1]) || 
                (Math.abs(pos1[1] - pos2[1]) <= 1 && pos1[0] === pos2[0])
              )
            );

            if (isConnected && !visited.has(otherIndex)) {
              stack.push(otherIndex);
            }
          }
        });
      }
    }

    shapeTypeCounts[currentType] = Math.max(shapeTypeCounts[currentType] || 0, connectedShapes.length);
  });
  
  let ret = []
  for (let key in shapeTypeCounts) {
    if (shapeTypeCounts[key] >= 3 && shapeTypeCounts[key] <= 9) {
      ret.push('connectShape' + String(shapeTypeCounts[key]) + '_' + key)
    } else if (shapeTypeCounts[key] > 9) {
      ret.push('connectShape9_' + key)
    }
  }
  return ret
}

// コネクトカラー判定
function checkConnectColor() {
  const colorCounts = {};

  shapeList.forEach((shape, index) => {
    const currentColor = shape.color;
    const connectedShapes = [];
    const stack = [index];
    const visited = new Set();

    while (stack.length > 0) {
      const currentIndex = stack.pop();

      if (!visited.has(currentIndex)) {
        visited.add(currentIndex);
        connectedShapes.push(currentIndex);

        const currentShape = shapeList[currentIndex];
        shapeList.forEach((otherShape, otherIndex) => {
          if (currentIndex !== otherIndex && currentShape.color === otherShape.color) {
            const isConnected = currentShape.positions.some(pos1 =>
              otherShape.positions.some(pos2 =>
                (Math.abs(pos1[0] - pos2[0]) <= 1 && pos1[1] === pos2[1]) || 
                (Math.abs(pos1[1] - pos2[1]) <= 1 && pos1[0] === pos2[0])
              )
            );

            if (isConnected && !visited.has(otherIndex)) {
              stack.push(otherIndex);
            }
          }
        });
      }
    }

    colorCounts[currentColor] = Math.max(colorCounts[currentColor] || 0, connectedShapes.length);
  });
  
  let ret = []
  for (let key in colorCounts) {
    if (colorCounts[key] >= 3 && colorCounts[key] <= 6) {
      ret.push('connectColor' + String(colorCounts[key]) + '_' + key)
    } else if (colorCounts[key] > 6) {
      ret.push('connectColor6' + '_' + key)
    }
  }
  return ret
}

// オールカラー判定
function checkAllColor() {
  // 色ごとの図形数 RED, YELLOW, GREEN, BLUE
  // 色の定数は1～4のため、アクセス時は-1する
  let colorCount = [0, 0, 0, 0]
  for (let i = 0; i < shapeList.length; i++) {
    colorCount[shapeList[i].color - 1]++
  }
  let min = Math.min(colorCount[0], colorCount[1], colorCount[2], colorCount[3])
  if (min === 1) {
    return 'allColor'
  } else if (min === 2) {
    return 'allColor2'
  } else if (min === 3) {
    return 'allColor3'
  }
}

// オールシェイプ判定
function checkAllShape() {
  let typeCount = [0, 0, 0, 0, 0]
  // let shapeCountI = shapeCountL = shapeCountO = shapeCountS = shapeCountT = 0
  for (let i = 0; i < shapeList.length; i++) {
    typeCount[shapeList[i].shapeType - 1]++
  }
  let min = Math.min(typeCount[0], typeCount[1], typeCount[2], typeCount[3], typeCount[4])
  if (min === 1) {
    return 'allShape'
  } else if (min === 2) {
    return 'allShape2'
  }
  return null
}

// 縦ストレート判定
function checkVerticalStraight() {
  for (let i = 0; i < WIDTH; i++) {
    let isVST = true
    if (field[0][i].state !== STATE_BLOCK) {
      continue
    }
    let targetColor = field[0][i].color
    for (let j = 0; j < HEIGHT; j++) {
      if (field[j][i].state !== STATE_BLOCK || field[j][i].color !== targetColor) {
        isVST = false
        break
      }
    }
    if (isVST) {
      return 'verticalStraight'
    }
  }
  return null
}

// 横ストレート判定
function checkHorizontalStraight() {
  for (let i = 0; i < HEIGHT; i++) {
    let isHST = true
    if (field[i][0].state !== STATE_BLOCK) {
      continue
    }
    let targetColor = field[i][0].color
    for (let j = 0; j < WIDTH; j++) {
      if (field[i][j].state !== STATE_BLOCK || field[i][j].color !== targetColor) {
        isHST = false
        break
      }
    }
    if (isHST) {
      return 'horizontalStraight'
    }
  }
  return null
}

// 指定した大きさの範囲が綺麗に図形で埋まっているか判定する
// スクエア系、スプレッド系の判定で使用する
// checkShapeType : 0:形状を気にしない 1:形状が全て一致 2:形状がひとつでも不一致
function isAreaFilledWithShape(search_height, search_width, checkShapeType) {
  let shape_num = (search_height * search_width) / 4
  for (let i = 0; i <= (HEIGHT - search_height); i++) {
    for (let j = 0; j <= (WIDTH - search_width); j++) {
      // 起点から指定マス分のフィールドを調べる
      let shapeNoList = []
      let shapeTypeList = []
      let isFillShape = true
      for (let i2 = 0; i2 < search_height; i2++) {
        for (let j2 = 0; j2 < search_width; j2++) {
          if (field[i+i2][j+j2].shapeNo > 0) {
            shapeNoList.push(field[i+i2][j+j2].shapeNo)
            shapeTypeList.push(field[i+i2][j+j2].shapeType)
          } else {
            isFillShape = false
            break
          }
        }
        if (!isFillShape) {
          break
        }
      }

      if (isFillShape && shapeNoList.length === (search_height * search_width)) {
        let counts = {}
        for (let x = 0; x < shapeNoList.length; x++) {
          if (!counts[shapeNoList[x]]) {
            counts[shapeNoList[x]] = 0
          }
          counts[shapeNoList[x]]++
        }
        const values = Object.values(counts)
        if (values.length === shape_num && values.every(count => count === 4)) {
          if (checkShapeType === 1) {
            // 図形の形状がすべて同じかチェックする（セイムスクエア用）
            let firstShapeType = shapeTypeList[0]
            let isSameSquare = true
            for (let x = 1; x < shapeTypeList.length; x++) {
              if (shapeTypeList[x] !== firstShapeType) {
                isSameSquare = false
                break
              }
            }
            if (isSameSquare) {
              return true
            }
          } else if (checkShapeType === 2) {
            // 図形の形状が一つでも異なることをチェックする（スクエア4用）
            let firstShapeType = shapeTypeList[0]
            for (let x = 1; x < shapeTypeList.length; x++) {
              if (shapeTypeList[x] !== firstShapeType) {
                return true
              }
            }
          } else {
            // checkShapeType === 0 は形状を気にしない
            return true
          }
        }
      }
    }
  }
  return false
}

// スクエア4判定
function checkSquare4() {
  // 4x4の図形があり、かつセイムでない
  if (isAreaFilledWithShape(4, 4, 2)) {
    return 'square4'
  } else {
    return null
  }
}

// セイムスクエア4判定
function checkSameSquare4() {
  if (isAreaFilledWithShape(4, 4, 1)) {
    return 'sameSquare4'
  } else {
    return null
  }
}

// スクエア9判定
function checkSquare9() {
  if (isAreaFilledWithShape(6, 6, 0)) {
    return 'square9'
  } else {
    return null
  }
}

// ハーフスプレッド判定
function checkHalfSpread() {
  if (shapeList.length < 6) {
    return null
  }
  if (isAreaFilledWithShape(4, 6, 0)) {
    return 'halfSpread'
  } else {
    return null
  }
}

// スプレッド判定
function checkSpread() {
  if (shapeList.length === 12) {
    return 'spread'
  } else {
    return null
  }
  // if (isAreaFilledWithShape(8, 6, false)) {
  //   return 'spread'
  // } else {
  //   return null
  // }
}

// 指定された位置の要素がフィールドの範囲内か
function isValid(row, col) {
  return row >= 0 && col >= 0 && row < HEIGHT && col < WIDTH;
}

// 指定された位置の要素と隣接する要素の位置をリストとして返す
function exploreAdjacentElements(visited, row, col, targetValue, positions) {
  if (!isValid(row, col) || visited[row][col] || field[row][col].shapeNo !== 0 || field[row][col].color !== targetValue) {
    return;
  }

  visited[row][col] = true;
  positions.push([row, col]); // 位置をリストに追加

  // 上下左右の隣接する要素を調べる
  const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  // for (const [dx, dy] of directions) {
  for (let i = 0; i < directions.length; i++) {
    const dx = directions[i][0]
    const dy = directions[i][1]
    exploreAdjacentElements(visited, parseInt(row) + dx, parseInt(col) + dy, targetValue, positions)
  }
}

// 色ごとのCSSのクラス名
function getColorClassName(color) {
  if (color === COLOR_RED) {
    return "red"
  } else if (color === COLOR_YELLOW) {
    return "yellow"
  } else if (color === COLOR_GREEN) {
    return "green"
  } else if (color === COLOR_BLUE) {
    return "blue"
  }
}

// フィールドを描画する
function showField() {
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      const elmId = "f_" + i + "_" + j
      const elm = document.getElementById(elmId)
      elm.classList.remove(...elm.classList)
    }
  }
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      var elm = document.getElementById("f_" + i + "_" + j)
      if (field[i][j].state !== STATE_NONE) {
        var color = getColorClassName(field[i][j].color)
        if (field[i][j].state === STATE_KUMO) {
          elm.classList.add("kumo");
          elm.classList.add(color)
        } else if (field[i][j].state === STATE_BLOCK) {
          elm.classList.add("block")
          elm.classList.add(color)
          addBorder([i, j])
        } else if (field[i][j].state === STATE_GOMI) {
          elm.classList.add("gray")
        }
      }
      // var div = elm.children[0]
      // div.style = 'font-size:x-small'
      // div.innerHTML = 'co:' + field[i][j].color + '<br>st:' + field[i][j].state + '<br>sh:' + field[i][j].shapeNo
    }
  }
}

// ブロックの外枠を追加する
function addBorder(position) {
  let row = position[0]
  let col = position[1]
  let positionShapeNo = field[row][col].shapeNo

  // 上
  if (!isValid(row + 1, col) || field[row + 1][col].shapeNo !== positionShapeNo) {
    document.getElementById("f_" + row + "_" + col).classList.add("border-top")
  }
  // 下
  if (!isValid(row - 1, col) || field[row - 1][col].shapeNo !== positionShapeNo) {
    document.getElementById("f_" + row + "_" + col).classList.add("border-bottom")
  }
  // 左
  if (!isValid(row, col - 1) || field[row][col - 1].shapeNo !== positionShapeNo) {
    document.getElementById("f_" + row + "_" + col).classList.add("border-left")
  }
  // 右
  if (!isValid(row, col + 1) || field[row][col + 1].shapeNo !== positionShapeNo) {
    document.getElementById("f_" + row + "_" + col).classList.add("border-right")
  }
}

// ツモを描画する
function showTumoField() {
  for (let i = 0; i < TUMO_HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      const elmId = "t_" + i + "_" + j
      const elm = document.getElementById(elmId)
      elm.classList.remove(...elm.classList)
    }
  }
  // 軸
  document.getElementById("t_1_" + (tumoJiku[0])).classList.add(getColorClassName(tumoJiku[1]))
  // 軸じゃない方
  if (tumoPair[0] === TUMO_RIGHT) {
    // 軸の右
    document.getElementById("t_1_" + (tumoJiku[0] + 1)).classList.add(getColorClassName(tumoPair[1]))
  } else if (tumoPair[0] === TUMO_BOTTOM) {
    // 軸の下
    document.getElementById("t_0_" + (tumoJiku[0])).classList.add(getColorClassName(tumoPair[1]))
  } else if (tumoPair[0] === TUMO_LEFT) {
    // 軸の左
    document.getElementById("t_1_" + (tumoJiku[0] - 1)).classList.add(getColorClassName(tumoPair[1]))
  } else if (tumoPair[0] === TUMO_UPPER) {
    // 軸の上
    document.getElementById("t_2_" + (tumoJiku[0])).classList.add(getColorClassName(tumoPair[1]))
  }
}

// ネクスト欄を秒がする
function showNextField(chara) {
  var len = 3
  if (chara === "noera") {
    len = 5
  }
  for (let i = 0; i < len; i++) {
    var nextTumo = tumoArray[currentTumoNo + 1 + i]
    var jikuElm = document.getElementById("n" + i + "_0")
    var pairElm = document.getElementById("n" + i + "_1")
    jikuElm.classList.remove(...jikuElm.classList)
    pairElm.classList.remove(...pairElm.classList)
    jikuElm.classList.add(getColorClassName(nextTumo[0]))
    pairElm.classList.add(getColorClassName(nextTumo[1]))
  }
}

function showYakuList() {
  // 役リストの更新
  let newYakuList = checkYaku()
  yakuList = newYakuList
  let addHtml = ''

  let tmpStarPoint = 0
  let yakuListForDisp = []
  for (let i = 0; i < yakuList.length; i++) {
    let yaku = yakuList[i]
    let connectType = ''
    // コネクトシェイプおよびコネクトカラーは種別が分かるように、末尾に色or形状の情報が追加されている
    if (yaku.startsWith('connectShape')) {
      connectType = parseInt(yaku.substring(14, 15))
      yaku = yaku.substring(0, 13)
      switch (connectType) {
        case SHAPE_TYPE_I:
          connectType = ' (I)'
          break
        case SHAPE_TYPE_O:
          connectType = ' (O)'
          break
        case SHAPE_TYPE_L:
          connectType = ' (L)'
          break
        case SHAPE_TYPE_S:
          connectType = ' (S)'
          break
        case SHAPE_TYPE_T:
          connectType - ' (T)'
          break
        default:
          connectType = ' (' + connectType + ')'
      }
    } else if (yaku.startsWith('connectColor')) {
      connectType = parseInt(yaku.substring(14, 15))
      yaku = yaku.substring(0, 13)
      switch (connectType) {
        case COLOR_RED:
          connectType = ' (赤)'
          break
        case COLOR_YELLOW:
          connectType = ' (黄)'
          break
        case COLOR_GREEN:
          connectType = ' (緑)'
          break
        case COLOR_BLUE:
          connectType = ' (青)'
          break
        default:
          connectType = ' (' + connectType + ')'
      }
    }
    const yakuStar = yakuScore[yaku]
    const dispName = yakuName[yaku] + connectType
    tmpStarPoint += yakuStar
    // 後でソートするため、いったんリストに入れる
    yakuListForDisp.push({'name': dispName, 'score': yakuStar})
  }
  // スコアの高い順にソート
  yakuListForDisp.sort((a, b) => b.score - a.score)
  for (let i = 0; i < yakuListForDisp.length; i++) {
    addHtml += '<div><div class="yakuStar">☆' + yakuListForDisp[i]['score'] + '</div> ' + yakuListForDisp[i]['name'] + '</div>'
  }
  document.getElementById('yakuList').innerHTML = addHtml
  // ついでに星数の更新
  starPoint = tmpStarPoint
}

// 得点の表示
function showScore() {
  let shapeLen = shapeList.length
  // 得点は 図形の数*1000 + ☆^2*150
  const totalScore = Math.floor(shapeLen * 1000 + starPoint * starPoint * 150 + minusScore)
  if (totalScore !== lastScore) {
    let diffScore = totalScore - lastScore
    if (diffScore > 0) {
      diffScore = '+' + diffScore
    }
    document.getElementById('totalScore').innerHTML = '点数: <strong>' + totalScore + '</strong><span class="diff">' + diffScore + '</span>'
    lastScore = totalScore
  } else {
    document.getElementById('totalScore').innerHTML = '点数: <strong>' + totalScore + '</strong>'
  }
  document.getElementById('shapeCount').innerHTML = '図形数: ' + shapeList.length
  if (starPoint !== lastStarPoint) {
    let diffStarPoint = starPoint - lastStarPoint
    if (diffStarPoint > 0) {
      diffStarPoint = '+' + diffStarPoint
    }
    document.getElementById('starPoint').innerHTML = '☆ x <strong>' + starPoint + '</strong><span class="diff">' + diffStarPoint + '</span>'
    lastStarPoint = starPoint
  } else {
    document.getElementById('starPoint').innerHTML = '☆ x <strong>' + starPoint + '</strong>'
  }
  document.getElementById('minusScore').innerHTML = '減点: ' + minusScore
}

function getTumo() {
  var nextTumo = tumoArray[++currentTumoNo]
  tumoJiku = [2, nextTumo[0]]
  tumoPair = [TUMO_RIGHT, nextTumo[1]]
  showTumoField()
  showNextField()
}

// LCG
function customRandom(seed) {
  let currentSeed = seed;

  return function() {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);
    currentSeed = (a * currentSeed + c) % m;
    return currentSeed / m;
  };
}

function editMode() {
  var fieldTable = document.getElementById('field')
  var tds = fieldTable.querySelectorAll('td')
  tds.forEach(function(td) {
    td.addEventListener('click', function(event) {
      var id = td.id
      var x = parseInt(id.substring(2,3))
      var y = parseInt(id.substring(4,5))
      if (currentEditKumo || currentEditKumo === 0) {
        editField(x, y, currentEditKumo)
      }
    })
  })
  
  var editKumoTds = document.getElementById('editKumo').querySelectorAll('td')
  editKumoTds.forEach(function(td) {
    td.addEventListener('click', function(event) {
      var id = td.id
      selectEditKumo(id)
    })
  })
}

function selectEditKumo(id) {
  const tdIdColorDict = {
    'editKumoRed': COLOR_RED,
    'editKumoYellow': COLOR_YELLOW,
    'editKumoGreen': COLOR_GREEN,
    'editKumoBlue': COLOR_BLUE,
    'editKumoDelete': COLOR_NONE
  }

  for (let key in tdIdColorDict) {
    document.getElementById(key).classList.remove('selected')
  }
  document.getElementById(id).classList.add('selected')
  currentEditKumo = tdIdColorDict[id]
}

// 編集モードでフィールドのセルを編集
function editField(x, y, color) {
  let targetField = field[x][y]
  let tmpPosList = []
  if (targetField.state === STATE_BLOCK || targetField.state === STATE_GOMI) {
    // 置いた場所がブロックかゴミだった場合は図形番号で紐づく座標をすべてくもの状態に戻す
    let editShapeNo = targetField.shapeNo
    for (let i = shapeList.length - 1; i >= 0; i--) {
      if (shapeList[i].shapeNo === editShapeNo) {
        for (let j = shapeList[i].positions.length - 1; j >= 0; j--) {
          let pos = shapeList[i].positions[j]
          field[pos[0]][pos[1]].shapeNo = 0
          field[pos[0]][pos[1]].state = STATE_KUMO
          field[pos[0]][pos[1]].shapeType = 0
        }
        // 後で使うので座標リストを保持しておく
        tmpPosList = structuredClone(shapeList[i].positions)
        // リストから削除
        shapeList.splice(i, 1)
        break
      }
    }
    for (let i = gomiList.length - 1; i >= 0; i--) {
      if (gomiList[i].shapeNo === editShapeNo) {
        for (let j = gomiList[i].positions.length - 1; j >= 0; j--) {
          let pos = gomiList[i].positions[j]
          field[pos[0]][pos[1]].shapeNo = 0
          field[pos[0]][pos[1]].state = STATE_KUMO
          field[pos[0]][pos[1]].shapeType = 0
        }
        // 後で使うので座標リストを保持しておく
        tmpPosList = structuredClone(gomiList[i].positions)
        // リストから削除
        gomiList.splice(i, 1)
        break
      }
    }
  }
  field[x][y].color = color
  field[x][y].shapeNo = 0
  if (color === COLOR_NONE) {
    field[x][y].state = STATE_NONE
  } else {
    field[x][y].state = STATE_KUMO
    createShape([x, y], null)
  }
  for (let i = 0; i < tmpPosList.length; i++) {
    createShape(tmpPosList[i], null)
  }
  updateDisp()
}

function resetAllState() {
  yakuList = []
  starPoint = 0
  minusScore = 0
  lastScore = 0
  lastStarPoint = 0
  currentTumoNo = 0
  currentShapeNo = 0
  shapeList = []
  gomiList = []
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      field[i][j] = {
        'color': 0,
        'state': STATE_NONE,
        'shapeNo': 0,
        'shapeType': 0
      }
    }
  }
  const chara = document.getElementById('chara')
  const val = chara.options[chara.selectedIndex].value
  createTumoPattern(val)
  getTumo()
  updateDisp()
}

function updateDisp() {
  showField()
  showYakuList()
  showScore()
}

// 現在の状態からURLパラメータを生成する
function createUrlParam() {
  const colorCodeToStr = {
    1: 'r',
    2: 'y',
    3: 'g',
    4: 'b',
  }
  // r12345678gr1234567890
  let shapeParam = ''
  // 図形は色1文字＋4マスの座標8文字
  for (let i = 0; i < shapeList.length; i++) {
    shapeParam += String(colorCodeToStr[shapeList[i].color])
    for (let j = 0; j < shapeList[i].positions.length; j++) {
      shapeParam += String(shapeList[i].positions[j][0]) + String(shapeList[i].positions[j][1])
    }
  }
  let gomiParam = ''
  // ゴミは色1文字＋座標N文字
  for (let i = 0; i < gomiList.length; i++) {
    gomiParam += String(colorCodeToStr[gomiList[i].color])
    for (let j = 0; j < gomiList[i].positions.length; j++) {
      gomiParam += String(gomiList[i].positions[j][0]) + String(gomiList[i].positions[j][1])
    }
  }
  let kumoParam = ''
  // くもは(色1文字＋座標2文字)の繰り返し
  for (let i = 0; i < HEIGHT; i++) {
    for (let j = 0; j < WIDTH; j++) {
      if (field[i][j].state === STATE_KUMO) {
        kumoParam += String(colorCodeToStr[field[i][j].color]) + String(i) + String(j)
      }
    }
  }
  let param = shapeParam
  param += gomiParam
  param += kumoParam
  let elm = document.getElementById('url')
  const url = window.location.href.replace(window.location.search, '').replace(window.location.hash, '')
  elm.value = url + '?f=' + param
}

function parseParam(param) {
  const strToColorCode = {
    'r': 1,
    'y': 2,
    'g': 3,
    'b': 4
  }

  const blockParam = param
  const splitBlockParam = blockParam.match(/[rygb]|\d+/g)
  let idx = 0
  while (idx < splitBlockParam.length) {
    let color = strToColorCode[splitBlockParam[idx++]]
    let positions = splitBlockParam[idx++].match(/\d{1,2}/g)
    for (let i = 0; i < positions.length; i++) {
      const x = parseInt(positions[i].substring(0, 1))
      const y = parseInt(positions[i].substring(1, 2))
      field[x][y].color = color
      field[x][y].state = STATE_KUMO
    }
    // 配置したら図形判定
    createShape([parseInt(positions[0].substring(0, 1)), parseInt(positions[0].substring(1, 2))], null)
  }
}

function init() {
  resetAllState()
  editMode()

  const urlParams = new URLSearchParams(window.location.search)
  const val = urlParams.get('f')
  if (val) {
    parseParam(val)
    updateDisp()
  }
  
  var chara = document.getElementById('chara')
  chara.addEventListener('change', function(event) {
    resetAllState()
    chara.blur()
  })

  var outUrlButton = document.getElementById('outUrlButton')
  outUrlButton.addEventListener('click', function(event) {
    createUrlParam()
  })
  var urlInput = document.getElementById('url')
  urlInput.addEventListener('click', function(event) {
    urlInput.select()
  })
  
  // キー入力
  document.addEventListener("keydown", function(event) {
    if (event.key === "ArrowLeft") {
      // ツモを左に動かす
      moveTumo("moveLeft")
    } else if (event.key === "ArrowRight") {
      // ツモを右に動かす
      moveTumo("moveRight")
    } else if (event.key === "ArrowUp") {
      // 落下させる
      fallTumo()
    } else if (event.key === "z") {
      // 左回転
      moveTumo("rotateLeft")
    } else if (event.key === "x") {
      // 右回転
      moveTumo("rotateRight")
    } else if (event.key === "r") {
      // リセット
      resetAllState()
    }
  })
}

document.addEventListener('DOMContentLoaded', function() {
  init()
})
