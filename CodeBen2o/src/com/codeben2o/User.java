package com.codeben2o;

public class User {
	private String email;
	private String displayName;
	
	public User(String email, String displayName) {
		this.email = email;
		this.displayName = displayName;
	}
	
	public String getEmail() {
		return this.email;
	}
	
	public String getDisplayName() {
		return this.displayName;
	}
}
