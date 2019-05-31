/* global Phaser */

import config from '../config.js'
import GridItem from './grid.item.js'

class Grid extends Phaser.GameObjects.Container {
  constructor (scene, x, y, options) {
    if (options.values && options.colLength * options.rowLength !== options.values.length) {
      throw new Error('Grid must be a rectangle')
    }

    super(scene, x, y)

    this.items = []
    this.selectedItem = null
    this.scene = scene
    this.rowLength = options.rowLength
    this.colLength = options.colLength
    this.itemWidth = options.itemWidth
    this.itemHeight = options.itemHeight
    this.itemScale = options.itemScale

    for (const [index, itemId] of this._generateValues(options).entries()) {
      this.addItem(index, itemId, { animation: false })
    }
  }

  _generateValues (options) {
    if (options.values) {
      return options.values
    } else {
      const values = []
      for (let index = 0; index < options.rowLength * options.colLength; index++) {
        values.push(this.getRandomItemType())
      }
      return values
    }
  }

  getRandomItemType () {
    const itemsIds = Object.keys(config.gridItems)

    const commonItems = itemsIds.slice(0, 3)
    const rareItems = itemsIds.slice(3)

    if (Math.random() < 0.7) return commonItems[Math.floor(Math.random() * commonItems.length)]
    else return rareItems[Math.floor(Math.random() * rareItems.length)]
  }

  async flushGrid () {
    const matchedItems = this.matchedInGrid()

    if (matchedItems.length > 0) {
      await this.removeMatched(matchedItems)
      await this.flushGrid()
    }
  }

  async removeMatched (matchedItems) {
    await this.removeItems(matchedItems)

    const dropPromises = []
    for (let col = 0; col < this.rowLength; col++) {
      dropPromises.push(this.dropItemsInCol(col))
    }
    await Promise.all(dropPromises)

    const addPromises = []
    for (const [index, item] of this.items.entries()) {
      if (item === null) {
        addPromises.push(this.addItem(index, this.getRandomItemType()))
      }
    }
    await Promise.all(addPromises)
  }

  matchedInGrid () {
    let matchedItems = new Set()

    for (let row = 0; row < this.colLength; row++) {
      matchedItems = new Set([...matchedItems, ...this.matchedInRow(row)])
    }

    for (let col = 0; col < this.rowLength; col++) {
      matchedItems = new Set([...matchedItems, ...this.matchedInCol(col)])
    }

    return [...matchedItems]
  }

  matchedInRow (row) {
    const startRowIndex = this._getStartRowIndex(row)
    const matched = []
    const currentPossibleMatch = {
      itemId: this.items[startRowIndex].itemId,
      indexes: [startRowIndex]
    }
    let currentIndex = startRowIndex + 1

    while (this._isInRow(currentIndex, row)) {
      const itemId = this.items[currentIndex].itemId
      if (itemId === currentPossibleMatch.itemId) {
        currentPossibleMatch.indexes.push(currentIndex)
      } else {
        if (currentPossibleMatch.indexes.length >= 3) {
          matched.push(...currentPossibleMatch.indexes)
        }

        currentPossibleMatch.itemId = itemId
        currentPossibleMatch.indexes = [currentIndex]
      }

      currentIndex++
    }

    if (currentPossibleMatch.indexes.length >= 3) {
      matched.push(...currentPossibleMatch.indexes)
    }

    return matched
  }

  matchedInCol (col) {
    const startColIndex = this._getStartColIndex(col)
    const matched = []
    const currentPossibleMatch = {
      itemId: this.items[startColIndex].itemId,
      indexes: [startColIndex]
    }
    let currentIndex = startColIndex + this.rowLength

    while (this._isInCol(currentIndex, col)) {
      const itemId = this.items[currentIndex].itemId
      if (itemId === currentPossibleMatch.itemId) {
        currentPossibleMatch.indexes.push(currentIndex)
      } else {
        if (currentPossibleMatch.indexes.length >= 3) {
          matched.push(...currentPossibleMatch.indexes)
        }

        currentPossibleMatch.itemId = itemId
        currentPossibleMatch.indexes = [currentIndex]
      }

      currentIndex += this.rowLength
    }

    if (currentPossibleMatch.indexes.length >= 3) {
      matched.push(...currentPossibleMatch.indexes)
    }

    return matched
  }

  async dropItemsInCol (col) {
    const itemsToFall = {}
    let holesCount = 0

    for (const index of this._getColItems(col).reverse()) {
      if (this.items[index] === null) {
        holesCount++
      } else if (holesCount > 0) {
        if (!itemsToFall[holesCount]) itemsToFall[holesCount] = []
        itemsToFall[holesCount].push(index)
      }
    }

    const dropPromises = []

    for (const holesCount in itemsToFall) {
      dropPromises.push(this.dropItems(itemsToFall[holesCount], +holesCount))
    }

    await Promise.all(dropPromises)
  }

  async dropItems (indexes, count) {
    const dropAnimPromises = []
    for (const index of indexes) {
      const endX = this.items[index].item.x
      const endY = (this._getRow(index) + count) * this.itemHeight + 50 * this.itemScale
      dropAnimPromises.push(this.swapItemAnim(this.items[index].item, { endX, endY }))
    }
    await Promise.all(dropAnimPromises)

    for (const index of indexes) {
      const item = this.items[index]
      const targetIndex = this._getIndexFromRowAndCol(this._getRow(index) + count, this._getCol(index))

      this.items[index] = null
      this.items[targetIndex] = item
    }
  }

  async swapItemById (id1, id2) {
    const index1 = this.getItemIndex(id1)
    const index2 = this.getItemIndex(id2)

    await this.swapItem(index1, index2)
  }

  async swapItem (index1, index2) {
    const item1 = this.items[index1]
    const item2 = this.items[index2]
    const endX1 = item2.item.x
    const endY1 = item2.item.y
    const endX2 = item1.item.x
    const endY2 = item1.item.y

    await Promise.all([
      this.swapItemAnim(item1.item, { endX: endX1, endY: endY1 }),
      this.swapItemAnim(item2.item, { endX: endX2, endY: endY2 })
    ])

    this.items[index1] = item2
    this.items[index2] = item1
  }

  async swapItemAnim (item, { endX, endY }) {
    return new Promise((resolve) => {
      this.scene.tweens.add({
        targets: [item],
        ease: 'Sine.easeInOut',
        duration: 250,
        delay: 0,
        props: {
          x: {
            getStart: () => item.x,
            getEnd: () => endX
          },
          y: {
            getStart: () => item.y,
            getEnd: () => endY
          }
        },
        onComplete: resolve
      })
    })
  }

  getItem (id) {
    return this.items.find(i => i && i.item.id === id)
  }

  getItemIndex (id) {
    return this.items.findIndex(i => i && i.item.id === id)
  }

  addItem (index, itemId, { animation } = {}) {
    const { x, y } = this._getPosition(index)
    const item = new GridItem(this.scene, x, y, itemId, this.gridItemClick.bind(this), this.gridItemDragOut.bind(this))
    item.setScale(this.itemScale)
    this.add(item)

    this.items[index] = { item, itemId }

    if (!animation) return this.addItemAnim(item)
  }

  async addItemAnim (item) {
    return new Promise((resolve) => {
      this.scene.add.tween({
        targets: [item],
        ease: 'Bounce',
        duration: 250,
        delay: 0,
        scaleX: {
          getStart: () => 0,
          getEnd: () => this.itemScale
        },
        scaleY: {
          getStart: () => 0,
          getEnd: () => this.itemScale
        },
        onComplete: resolve
      })
    })
  }

  async gridItemClick (gridItem) {
    if (!this.canMove) return

    if (this.selectedItem === null) {
      this.selectItem(gridItem.id)
    } else {
      if (this.isNeighbors(this.selectedItem, gridItem.id)) {
        await this.swapGridItems(this.selectedItem, gridItem.id)
      } else {
        this.selectItem(gridItem.id)
      }
    }
  }

  async gridItemDragOut (gridItem, pointer) {
    if (!this.canMove) return

    if (pointer.isDown) {
      const angle = pointer.angle * 57.2957795

      const index = this.getItemIndex(gridItem.id)
      const row = this._getRow(index)
      const col = this._getCol(index)

      if (
        angle > -45 && angle < 45 && col !== this.rowLength - 1
      ) {
        await this.dragItems(gridItem, row, col + 1)
      } else if (
        angle >= 45 && angle < 115 && row !== this.colLength - 1
      ) {
        await this.dragItems(gridItem, row + 1, col)
      } else if (
        ((angle >= 115 && angle < 180) || (angle <= -115 && angle > -180)) &&
        col !== 0
      ) {
        await this.dragItems(gridItem, row, col - 1)
      } else if (
        angle > -115 && angle < -45 && row !== 0
      ) {
        await this.dragItems(gridItem, row - 1, col)
      }
    }
  }

  async dragItems (gridItem, row, col) {
    const targetIndex = this._getIndexFromRowAndCol(row, col)
    const targetItem = this.items[targetIndex].item
    if (targetItem) {
      await this.swapGridItems(gridItem.id, targetItem.id)
    }
  }

  async swapGridItems (firstItem, secondItem) {
    this.canMove = false

    await this.swapItemById(firstItem, secondItem)
    this.deselectItem()

    const matchedItems = this.matchedInGrid()
    if (matchedItems.length > 0) {
      await this.flushGrid()
    } else {
      await this.swapItemById(secondItem, firstItem)
    }

    this.canMove = true
  }

  selectItem (id) {
    if (this.selectedItem !== null) this.getItem(this.selectedItem).item.setScale(this.itemScale)
    this.selectedItem = id
    this.getItem(id).item.setScale(this.itemScale * 1.1)
  }

  deselectItem () {
    if (this.selectedItem !== null) this.getItem(this.selectedItem).item.setScale(this.itemScale)
    this.selectedItem = null
  }

  async removeItemsInCol (startIndex, count) {
    const col = this._getCol(startIndex)
    const removeIndexes = []
    let currentIndex = startIndex

    while (count--) {
      if (this._isInCol(currentIndex, col)) break

      removeIndexes.push(currentIndex)
      currentIndex += this.rowLength
    }

    await this.removeItems(removeIndexes)
  }

  async removeItemsInRow (startIndex, count) {
    const row = this._getRow(startIndex)
    const removeIndexes = []
    let currentIndex = startIndex

    while (count--) {
      if (this._isInRow(currentIndex, row)) break

      removeIndexes.push(currentIndex)
      currentIndex++
    }

    await this.removeItems(removeIndexes)
  }

  async removeItems (indexes) {
    return Promise.all(indexes.map(index => this.removeItem(index)))
  }

  async removeItem (index) {
    const item = this.items[index].item
    await this.removeItemAnim(item)
    this.scene.events.emit('item-removed', index)
    this.items.splice(index, 1, null)
    item.destroy()
  }

  async removeItemAnim (item) {
    return new Promise((resolve) => {
      this.scene.add.tween({
        targets: [item],
        ease: 'Bounce',
        duration: 250,
        delay: 0,
        scaleX: {
          getEnd: () => 0
        },
        scaleY: {
          getEnd: () => 0
        },
        onComplete: resolve
      })
    })
  }

  isNeighbors (id1, id2) {
    const index1 = this.getItemIndex(id1)
    const index2 = this.getItemIndex(id2)
    const col1 = this._getCol(index1)
    const col2 = this._getCol(index2)
    const row1 = this._getRow(index1)
    const row2 = this._getRow(index2)

    if (col1 === col2 && Math.abs(row1 - row2) === 1) return true
    if (row1 === row2 && Math.abs(col1 - col2) === 1) return true

    return false
  }

  _getPosition (index) {
    return {
      x: this._getCol(index) * this.itemWidth + 50 * this.itemScale,
      y: this._getRow(index) * this.itemHeight + 50 * this.itemScale
    }
  }

  _getIndexFromRowAndCol (row, col) {
    return row * this.rowLength + col
  }

  _getCol (index) {
    return index % this.rowLength
  }

  _isInCol (index, col) {
    return this._getCol(index) === col && index < this.items.length
  }

  _loopThroughCol (col, callback) {
    const startIndex = this._getStartColIndex(col)
    let currentIndex = startIndex

    while (this._isInCol(currentIndex, col)) {
      callback(currentIndex)
      currentIndex += this.rowLength
    }
  }

  _getColItems (col) {
    const indexes = []
    this._loopThroughCol(col, (index) => indexes.push(index))
    return indexes
  }

  _getRow (index) {
    return Math.floor(index / this.rowLength)
  }

  _isInRow (index, row) {
    return this._getRow(index) === row
  }

  _loopThroughRow (row, callback) {
    const startIndex = this._getStartRowIndex(row)
    let currentIndex = startIndex

    while (this._isInRow(currentIndex, row)) {
      callback(currentIndex)
      currentIndex++
    }
  }

  _getRowItems (col) {
    const indexes = []
    this._loopThroughRow(col, (index) => indexes.push(index))
    return indexes
  }

  _getStartRowIndex (row) {
    return row * this.rowLength
  }

  _getStartColIndex (col) {
    return col
  }
}

export default Grid
