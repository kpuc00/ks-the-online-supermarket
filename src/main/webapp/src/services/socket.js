import SockJs from 'sockjs-client'
import Stomp from 'stompjs'

let stompClient = null;
let orders = [];

export const socket = {
    showOrder(order) {
        console.log(order);
        orders = order;
    },

    // setConnected(connected) {
    //     console.log(connected);
    // },

    connect() {
        const socket = new SockJs('http://localhost:8080/socket');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function (frame) {
            console.log(true);
            console.log('Connected: ' + frame);
            stompClient.subscribe('/getOrders', function (order) {
                this.showOrder(JSON.parse(order.body).content);
            });
        });
    },

    check() {
        const ws = {
            stompClient: stompClient,
            orders: orders
        }
        if (!ws /*|| ws.readyState === WebSocket.CLOSED*/) this.connect(); //check if websocket instance is closed, if so call `connect` function.
    }
}