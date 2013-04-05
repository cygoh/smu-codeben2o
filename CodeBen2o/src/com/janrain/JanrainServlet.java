package com.janrain;

import java.io.IOException;
import java.io.PrintWriter;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.googlecode.janrain4j.api.engage.EngageFailureException;
import com.googlecode.janrain4j.api.engage.EngageService;
import com.googlecode.janrain4j.api.engage.EngageServiceFactory;
import com.googlecode.janrain4j.api.engage.ErrorResponeException;
import com.googlecode.janrain4j.api.engage.response.UserDataResponse;
import com.googlecode.janrain4j.api.engage.response.profile.Profile;

/**
 * Servlet implementation class JanrainServlet
 */
public class JanrainServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public JanrainServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		 // Retrieve the token sent by Janrain 
        String token = request.getParameter("token");
        
        // Get the EngageService
        EngageService engageService = EngageServiceFactory.getEngageService();
        PrintWriter out = response.getWriter();

        try {
            // Retrieve the Janrain user data
            UserDataResponse userDataResponse = engageService.authInfo(token);
            Profile profile = userDataResponse.getProfile();
            String identifier = profile.getIdentifier();
            String result = userDataResponse.getResponseAsJSON();
            
            // TODO Retrieve more user data like name, email, friends, ...

            // TODO Do something with the retrieved user data 
            response.sendRedirect("/construction.jsp");
        }
        catch (EngageFailureException e) {
            // TODO
        }
        catch (ErrorResponeException e) {
            // TODO
        }
        catch (Exception e) {
        	
        }
        
	}

}
