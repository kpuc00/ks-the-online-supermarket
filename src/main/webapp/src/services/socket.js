import SockJs from 'sockjs-client'
import Stomp from 'stompjs'

let stompClient = null;

export const socket = {
    connect() {
        const socket = new SockJs('http://localhost:8080/socket');
        stompClient = Stomp.over(socket);
        stompClient.connect({}, function () {
            stompClient.subscribe('/api/orders/getOrders', function () {
                stompClient.disconnect(()=>("Disconnected"));
                window.location.reload();
            });
        });
    },

    send(order) {
        stompClient.send(`/api/orders/processing`, {}, JSON.stringify({order: order}));
    }
}