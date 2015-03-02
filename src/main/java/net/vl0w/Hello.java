package main.java.net.vl0w;

import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.core.MediaType;

@Path("hello")
public class Hello {

	@GET
	@Produces(MediaType.TEXT_PLAIN)
	public String getIt() {
		return System.getenv("net.vl0w.isd.pw_readonly");
	}
}
