package com.ks.service.ks.websocket;

import com.ks.service.ks.model.Order;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@Controller
public class MessageMapper {
	// add/edit teacher's location
	@MessageMapping("/processing")
	@SendTo("/api/orders/getOrders")
	public String getNewOrder(String string) {
		return string;
	}
}
