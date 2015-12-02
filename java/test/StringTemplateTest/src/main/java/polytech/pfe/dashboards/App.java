package polytech.pfe.dashboards;

import org.stringtemplate.v4.*;
import java.io.*;


/**
 * Hello world!
 *
 */
public class App 
{
    public static void main ( String[] args )throws Exception
    {
/*	//To use a simple template that can fit in a string : 
        ST hello = new ST("Hello, <name>");
        hello.add("name", "World");
        System.out.println(hello.render());
		
		//Now, if you want to use an external file as a template : 
		// Load the file (it is a group template file)
		final STGroup stGroup = new STGroupFile("test.stg");

		// Pick the correct template into that file 
		final ST templateExample = stGroup.getInstanceOf("templateExample");
		

		// Pass on values to use when rendering
		templateExample.add("param", "Hello World");

		// Render
		final String renderTest = templateExample.render();

		// Print
		System.out.println(renderTest);

		System.out.println("Hoy");
		
		// You can pick the other template if you want : 
		final ST otherExample = stGroup.getInstanceOf("mySecondTemplate");
		otherExample.add("secondParam", "I'm a param !");
		otherExample.add("YetAnotherOne", "this parametre here");
		// Render
		final String otherRender = otherExample.render();
		// Print on stdout
		System.out.println(otherRender);
		*/
		//Import as a template group the whole folder ??
		STGroup group =  new STGroupFile("myJavascriptTest.stg");
		   
		ST lineChart = group.getInstanceOf("myJavascriptTest");
 /*
 WidgetDescription(String nbOfGraph, String yTitle, String dataName)
 */
		WidgetDescription widget = new WidgetDescription("c1", "Température (°C)", "temperatureArray");
		lineChart.add("nbOfGraph", widget.getNbOfGraph());		
		lineChart.add("yTitle", widget.getYTitle());
		lineChart.add("dataName", widget.getDataName());


//		myJavascriptTest(nbOfGraph, yTitle, dataName) ::= <<

		String jsResult = lineChart.render();
		System.out.println(jsResult);
		
		//print in a file : 
		//lineChart.write("./result.js");
		
		PrintWriter output = new PrintWriter("result.js");
		output.println(jsResult);
		output.close();
    }
}
