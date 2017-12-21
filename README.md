# zen-lru

[![npm version](https://img.shields.io/npm/v/zen-lru.svg)](https://www.npmjs.com/package/zen-lru)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com)

zen-lru 是一个精简的 JavaScript 数据缓存库，使用 最近最少使用 (LRU) 算法，摘自 Rasmus Andersson 的 [js-lru](https://github.com/rsms/js-lru)。

**思路：**

	     entry             entry             entry             entry
	     ______            ______            ______            ______
	    | head |.newer => |      |.newer => |      |.newer => | tail |
	    |  A   |          |  B   |          |  C   |          |  D   |
	    |______| <= older.|______| <= older.|______| <= older.|______|
	removed  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  added

## 安装

```bash
npm install zen-lru
```

## 使用

```javascript
const Cache = require('zen-lru')

const cache = new Cache(1000) // 参数 1000 用于限制缓存最大数量，可选，默认为 5000
cache.set('a', {foo: 'bar'})
cache.get('a') // {foo: "bar"}
```

## 特性

1. 只实现了最常用的 get 和 set 方法
2. 一律使用全等于（===）undefined 来判断数据是否存在
3. 新增最大缓存数默认值：5000
4. get 方法第二个参数，默认开发者主动忽略
5. 调用 set 方法时，如果超过了最大缓存数，不再返回被删除的数据
