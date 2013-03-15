/*******************************************************************************
 * Copyright 2011, 2012 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
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
package fr.cnes.sitools.userstorage.model;

/**
 * Different resource actions
 * 
 * @author AKKA
 */
public enum Action {
  
  /** Start action */
  START("start"), 
  /** Stop action */
  STOP("stop"), 
  /** refresh action */
  REFRESH("refresh"), 
  /** Clean action */
  CLEAN("clean"), 
  /** Notify user action > mail */
  NOTIFY("notify");

  /**
   * The label
   */
  private String label;

  /**
   * Private constructor for building Action objects
   * @param operator String
   */
  private Action(String operator) {
    this.label = operator;
  }

  /**
   * Get the label
   * 
   * @return the Action's label
   */
  public String value() {
    return label;
  }
}
