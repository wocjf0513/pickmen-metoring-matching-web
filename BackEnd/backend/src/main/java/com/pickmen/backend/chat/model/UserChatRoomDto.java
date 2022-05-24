package com.pickmen.backend.chat.model;

import lombok.Getter;

@Getter
public class UserChatRoomDto {
	
	private long user_id;
	
	private long other_id;
		
	private long chatRoom_id;	
	
	public UserChatRoomDto(long user_id, long other_id, long chatRoom_id) {
		this.user_id = user_id;
		this.other_id = other_id;
		this.chatRoom_id = chatRoom_id;
	}
}
