/**
 * a forest is an object of this type:
 * {
 *     playerName: 'player',
 *     points: 0,
 *     cards: [
 *      {
 *          name: 'beech',
 *          count: 3
 *      },
 *      {
 *          name: 'birch',
 *          count: 1
 *      }
 *     ]
 *
 * }
 */
import cards from "@/model/cards.js";
import {calculateButterflyPoints} from "@/model/card-butterflies.js";

export class Forest {

    constructor(playerName, allForests) {
        this.playerName = playerName
        this.allForrests = allForests
        this.butterflyPoints = 0
        this.points = 0
        this.cards = []
        for (let card of cards) {
            this.cards.push({
                ...card,
                count: 0,
                points: 0
            })
        }
    }

    findCard(cardName) {
        return this.cards[this.cards.findIndex(c => c.name === cardName)]
    }

    addCard(cardName) {
        ++this.findCard(cardName).count
    }

    removeCard(cardName) {
        const c = this.findCard(cardName)
        c.count = Math.max(0, --c.count)
    }

    addParam(cardName) {
        const card = this.findCard(cardName)
        card.param.value = Math.min(card.count, card.param.value + 1)
    }

    subParam(cardName) {
        const card = this.findCard(cardName)
        card.param.value = Math.max(0, card.param.value - 1)
    }

    updatePoints() {
        let points = 0
        for (let card of this.cards) {
            card.recalculatePoints(this)
            points += card.points
        }
        this.butterflyPoints = calculateButterflyPoints(this)
        this.points = points + this.butterflyPoints
    }

    countByName(cardName) {
        return this.cards.find(c => c.name === cardName).count
    }

    countBySymbol(symbolName) {
        return this.cards.filter(c => c.symbols.filter(s => s === symbolName).length > 0)
            .reduce((sum, c) => sum += c.count, 0)
    }

    countDistinctBySymbol(symbolName) {
        return this.cards.filter(c => c.symbols.filter(s => s === symbolName).length > 0)
            .filter(c => c.count > 0)
            .length
    }

    hasMostOfName(cardName) {
        const inThisForest = this.countByName(cardName)
        let noOtherForestHasMore = true
        const otherForests = this.allForrests.filter(f => f.playerName !== this.playerName)
        for (let otherForest of otherForests) {
            if (otherForest.countByName(cardName) > inThisForest)
                noOtherForestHasMore = false
        }
        return noOtherForestHasMore
    }

    hasMostOfSymbol(symbolName) {
        const inThisForest = this.countBySymbol(symbolName)
        let noOtherForestHasMore = true
        const otherForests = this.allForrests.filter(f => f.playerName !== this.playerName)
        for (let otherForest of otherForests) {
            if (otherForest.countBySymbol(symbolName) > inThisForest)
                noOtherForestHasMore = false
        }
        return noOtherForestHasMore
    }

}