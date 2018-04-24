export default {
    increment() {
        return {
            type: 'INCREMENT'
        }
    },
    decrement() {
        return {
            type: 'DECREMENT'
        }
    },
    changeText(value) {
        return {
            type: 'CHANGE_TEXT',
            text: value
        }
    }
}