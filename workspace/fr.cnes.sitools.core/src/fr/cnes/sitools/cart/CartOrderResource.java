/*******************************************************************************
 * Copyright 2010-2013 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
 *
 * This file is part of SITools2.
 *
 * SITools2 is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * SITools2 is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with SITools2.  If not, see <http://www.gnu.org/licenses/>.
 ******************************************************************************/
package fr.cnes.sitools.cart;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.AbstractMap;
import java.util.Calendar;
import java.util.Map;
import java.util.Map.Entry;
import org.codehaus.jackson.map.ObjectMapper;
import org.restlet.data.MediaType;
import org.restlet.ext.jackson.JacksonRepresentation;
import org.restlet.ext.json.JsonRepresentation;
import org.restlet.ext.wadl.MethodInfo;
import org.restlet.ext.xstream.XstreamRepresentation;
import org.restlet.representation.Representation;
import org.restlet.representation.Variant;
import org.restlet.resource.Get;
import org.restlet.resource.Put;
import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.converters.Converter;
import com.thoughtworks.xstream.converters.MarshallingContext;
import com.thoughtworks.xstream.converters.UnmarshallingContext;
import com.thoughtworks.xstream.io.HierarchicalStreamReader;
import com.thoughtworks.xstream.io.HierarchicalStreamWriter;
import fr.cnes.sitools.cart.model.CartSelection;
import fr.cnes.sitools.cart.model.CartSelections;
import fr.cnes.sitools.common.SitoolsSettings;
import fr.cnes.sitools.common.XStreamFactory;

/**
 * Resource for POSTing new orders
 * 
 */
public final class CartOrderResource extends AbstractCartOrderResource {

  /** Application Settings */
  private SitoolsSettings settings = ((CartOrderApplication) getApplication()).getSettings();

  @Override
  public void sitoolsDescribe() {
    setName("CartOrderResource");
    setDescription("Resource for downloading orders");
  }

  @Override
  public void describeGet(MethodInfo info) {

    info.setDocumentation("Method used to test application exposition.");
    this.addStandardGetRequestInfo(info);
    this.addStandardObjectResponseInfo(info);
    this.addStandardInternalServerErrorInfo(info);
    this.addStandardResourceCollectionFilterInfo(info);

  }

  @Get
  public Representation get(Variant variant) {
    return new JsonRepresentation("");
  }

  @Put
  public Representation action(Representation representation, Variant variant) {
    
    CartSelections cartSelections = getObject(representation, variant);
    StringBuffer xml = null;

    String user = this.getRequest().getClientInfo().getUser().getIdentifier();
    String root = settings.getString("Starter.ROOT_DIRECTORY");
    String rootdir = getContext().getAttributes().get("USER_STORAGE_ROOT").
        toString().replace("${ROOT_DIRECTORY}", root) + "/" + user ;
    
    String inputdir = rootdir + "/dataSelection/records/";

    
    try {
      
      Calendar cal = Calendar.getInstance();
      SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd-HH-mm-ss");
      String date = sdf.format(cal.getTime());
      
      File outputdir = new File(rootdir + "/resources_orders/dataset_" + date);
      
      for ( CartSelection sel : cartSelections.getSelections() ){
        
        String filepath =  inputdir + user + "_" + sel.getSelectionId() + "_records.json";

        ObjectMapper mapper = new ObjectMapper();
        CartSelection cartSelection = mapper.readValue(new File(filepath), CartSelection.class);
        sel.setRecords(cartSelection.getRecords());
        
        // serialize to XML
        XStream xstream = new XStream();
        xstream.alias("root", Map.class);
        xstream.registerConverter(new MapEntryConverter());
  
        if (xml == null){
          xml = new StringBuffer (xstream.toXML(sel));
        } else {
          xml.append(xstream.toXML(sel));
        }
        
      }
      
      outputdir.mkdir();
      
      writeToFile(outputdir + "/metadata.xml", xml);  
      
    }
     
    catch (Exception e) {
      return new JsonRepresentation("label.download_ko");
    }

    return new JsonRepresentation("label.download_ok");
    

    
  }
  
  
  public final CartSelections getObject(Representation representation, Variant variant) {
  
    
    CartSelections selections = null;

    if (MediaType.APPLICATION_XML.isCompatible(representation.getMediaType())) {
       XstreamRepresentation<CartSelections> repXML = new XstreamRepresentation<CartSelections>(representation);
       XStream xstream = XStreamFactory.getInstance().getXStreamReader(MediaType.APPLICATION_XML);
       repXML.setXstream(xstream);
       selections = repXML.getObject();
    
    }
    else if (MediaType.APPLICATION_JSON.isCompatible(representation.getMediaType())) {
      //  Parse the JSON representation to get the bean
      selections = new JacksonRepresentation<CartSelections>(representation, CartSelections.class).getObject();
    }
    
    return selections;
  }
  

  public static void writeToFile(String pFilename, StringBuffer pData) throws IOException {  
    BufferedWriter out = new BufferedWriter(new FileWriter(pFilename));  
    out.write(pData.toString());  
    out.flush();  
    out.close();  
}  
  
  
  /**
   * MapEntryConverter
   * inner class
   * */
public static class MapEntryConverter implements Converter {

    public boolean canConvert(Class clazz) {
        return AbstractMap.class.isAssignableFrom(clazz);
    }

    public void marshal(Object value, HierarchicalStreamWriter writer, MarshallingContext context) {

        AbstractMap map = (AbstractMap) value;
        
        for (Object obj : map.entrySet()) {
            Entry entry = (Entry) obj;
            writer.startNode(entry.getKey().toString());
            writer.setValue(entry.getValue().toString());
            writer.endNode();
        }
    
    }

    @Override
    public Object unmarshal(HierarchicalStreamReader arg0, UnmarshallingContext arg1) {
      // TODO Auto-generated method stub
      return null;
    }

}

  
  
  
  

}
