# Noom

Zoom 클론 코딩으로 WebRTC + WebSockets 익히기. 

## 정리 노트

### Socket.io는 WebSocket의 구현이 아니다.

- Socket.io는 양방향 실시간 통신에 웹소켓을 사용하지만, 웹소켓을 사용할 수 없는 환경에서는 다른 기술(`HTTP Long-polling` 등)을 사용하여 동작한다.
- [Ref](https://socket.io/docs/v4/#what-socketio-is-not)

### HTTP Polling & Long-Polling

- Socket.io가 웹소켓을 사용할 수 없을 때 쓴다는 `HTTP Long-Polling`은 무엇일까?
- **Regular Polling**
  - 서버와 지속적으로 통신할 수 있는 가장 간단한 방법.
  - 클라이언트가 정해진 시간 간격으로 서버로부터 새로운 정보를 요청하는 것.
  - 대규모 서비스나 요청 데이터의 용량이 큰 경우 성능에 좋지 않은 방법이다.
- **Long Polling**
  - 일반적인 Polling과는 다르게 지연 없이 요청을 보내는 방법.
  - 클라이언트에서 서버로 요청을 보낸 후 무기한 대기한다.
  - 서버는 새로운 정보가 생기면 클라이언트에게 응답을 보낸다.
  - 클라이언트는 응답을 받는 즉시 새로운 요청을 보낸 후 무기한 대기한다.

| ![HTTP Long Polling](./images/http_long_polling.png) |
| :--------------------------------------------------: |
| [Ref: 모던 자바스크립트](https://ko.javascript.info) |

```js
// 브라우저에서 Long Polling을 구현하는 subscribe 함수.

async function subscribe() {
  let response = await fetch("/subscribe");

  if (response.status == 502) {
    // 요청이 timeout되거나, 서버가 닫혔다면 요청을 다시 보냄.
    await subscribe();
    return;
  }
  if (response.status != 200) {
    // 에러 핸들링 후 요청을 다시 보냄.
    showMessage(response.statusText);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await subscribe();
    return;
  }
  // 요청 성공 시 요청 받은 데이터를 보여주고 다시 요청을 보내서 서버의 응답을 기다림.
  let message = await response.text();
  showMessage(message);
  await subscribe();
}

subscribe();

// Ref: 모던 자바스크립트, https://ko.javascript.info
```

- 단, 응답을 받고자 하는 서버가 `pending` 상태의 여러 응답을 다룰 수 있는 구조여야 한다.