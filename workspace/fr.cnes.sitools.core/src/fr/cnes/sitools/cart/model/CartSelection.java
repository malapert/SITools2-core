package fr.cnes.sitools.cart.model;

import java.io.Serializable;
import java.util.List;
import java.util.Map;

import org.codehaus.jackson.annotate.JsonIgnore;

import fr.cnes.sitools.common.model.IResource;

public class CartSelection implements IResource, Serializable {

  /**
   * 
   */
  private static final long serialVersionUID = 2829660753185960207L;
  
  private String selectionId;
  private String selectionName;
  private String datasetId;
  private String dataUrl; 
  private String datasetName;
  private String nbRecords;
  private String orderDate;
  
  private List<Map<String, String>> records;
  
  
  public CartSelection(){
  }

  public String getSelectionName() {
    return selectionName;
  }
  public void setSelectionName(String selectionName) {
    this.selectionName = selectionName;
  }
  
  public String getDatasetId() {
    return datasetId;
  }
  public void setDatasetId(String datasetId) {
    this.datasetId = datasetId;
  }

  public String getDataUrl() {
    return dataUrl;
  }
  public void setDataUrl(String dataUrl) {
    this.dataUrl = dataUrl;
  }
  public String getDatasetName() {
    return datasetName;
  }
  public void setDatasetName(String datasetName) {
    this.datasetName = datasetName;
  }
  public String getNbRecords() {
    return nbRecords;
  }
  public void setNbRecords(String nbRecords) {
    this.nbRecords = nbRecords;
  }
  public String getOrderDate() {
    return orderDate;
  }
  public void setOrderDate(String orderDate) {
    this.orderDate = orderDate;
  }
  
  public String getSelectionId() {
    return selectionId;
  }
  public void setSelectionId(String selectionId) {
    this.selectionId = selectionId;
  }

  @Override
  public String getId() {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public void setId(String id) {
    // TODO Auto-generated method stub
    
  }

  @Override
  public String getName() {
    // TODO Auto-generated method stub
    return null;
  }

  @Override
  public String getDescription() {
    // TODO Auto-generated method stub
    return null;
  }

  public List<Map<String, String>> getRecords() {
    return records;
  }

  public void setRecords(List<Map<String, String>> records) {
    this.records = records;
  }
  


  
}
