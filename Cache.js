/**
 * zen-lru 是一个 JavaScript 缓存数据的库，使用 最近最少使用 (LRU) 算法，
 * 基于 Rasmus Andersson 的 js-lru: https://github.com/rsms/js-lru
 *
 * 思路：
 *       entry             entry             entry             entry
 *       ______            ______            ______            ______
 *      | head |.newer => |      |.newer => |      |.newer => | tail |
 *      |  A   |          |  B   |          |  C   |          |  D   |
 *      |______| <= older.|______| <= older.|______| <= older.|______|
 *
 *  removed  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  added
 *
 * 特性：
 *   1. 只实现了最常用的 get 和 set 方法
 *   2. 一律使用全等于（===）undefined 来判断数据是否存在
 *   3. 新增最大缓存数默认值：5000
 *   4. get 方法第二个参数，默认开发者主动忽略
 *   5. 调用 set 方法时，如果超过了最大缓存数，不再返回被删除的数据
 *
 * @constructor
 * @param {number} [limit=5000]
 */

function Cache (limit) {
    this.limit = limit || 5000
    this.size = 0
    this.head = undefined
    this.tail = undefined
    this._keymap = Object.create(null)
}

/**
 * 从缓存中获取指定数据，不存在则返回 undefined
 *
 * @param {string} key
 * @param {boolean} [_returnEntry]
 * @return {*|undefined}
 */

Cache.prototype.get = function (key, _returnEntry) {
    var entry = this._keymap[key]
    if (entry === undefined) {
        return undefined
    }

    if (entry !== this.tail) {
        // HEAD--------------TAIL
        //   <.older   .newer>
        //  <--- add direction --
        //   A  B  C  <D>  E
        if (entry.newer !== undefined) {
            if (entry === this.head) {
                this.head = entry.newer
            }
            entry.newer.older = entry.older // C <-- E.
        }
        if (entry.older !== undefined) {
            entry.older.newer = entry.newer // C. --> E
        }
        entry.newer = undefined // D --x
        entry.older = this.tail // D. --> E
        if (this.tail !== undefined) {
            this.tail.newer = entry // E. <-- D
        }
        this.tail = entry
    }

    return _returnEntry === true ? entry : entry.value
}

/**
 * 向缓存中添加一条数据
 *
 * @param {string} key
 * @param {*} value
 * @return
 */

Cache.prototype.set = function (key, value) {
    var entry = this.get(key, true)
    if (this.size === this.limit) {
        var removed = this.head
        if (removed !== undefined) {
            this.head = this.head.newer
            this.head.older = undefined
            removed.newer = undefined
            entry.older = undefined
            this._keymap[entry.key] = undefined
            this.size -= 1
        }
    }

    if (entry === undefined) {
        entry = {key: key}
        this._keymap[key] = entry
        if (this.tail !== undefined) {
            this.tail.newer = entry
            entry.older = this.tail
        } else {
            this.head = entry
        }
        this.tail = entry
        this.size += 1
    }
    entry.value = value
}


module.exports = Cache
