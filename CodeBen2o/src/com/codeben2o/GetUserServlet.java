package com.codeben2o;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.*;

/**
 * Servlet implementation class GetUserServlet
 */
public class GetUserServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public GetUserServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		getUser(request, response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}
	
	private void getUser(HttpServletRequest request, HttpServletResponse response) 
			throws ServletException, IOException {
		
		response.setContentType("application/json");
		
		HttpSession session = request.getSession();
		User user = (User)session.getAttribute("user");
		
		PrintWriter out = response.getWriter();
		JSONObject userJson = new JSONObject();
		
		try {
			if(user != null) {
				userJson.put("email", user.getEmail());
				userJson.put("displayName", user.getDisplayName());
				userJson.put("login", true);
			} else {
				userJson.put("email", "");
				userJson.put("displayName", "");
				userJson.put("login", false);
			}
			
			String callback = request.getParameter("callback");
			
			if(callback != null) {
				String content = callback + "(" + userJson.toString() + ")"; 
				out.print(content);
			} else {
				out.print(userJson);
			}
			
		} catch(JSONException ex) {}
	}

}
