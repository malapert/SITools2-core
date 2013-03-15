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
package fr.cnes.sitools.json;

import org.restlet.data.MediaType;

import fr.cnes.sitools.AbstractResetPasswordTestCase;
import fr.cnes.sitools.api.DocAPI;

/**
 * Test Reset an user Password
 * 
 * @since UserStory : Réinitialiser le mot de passe, Release 4 - Sprint : 3
 * 
 * @author b.fiorito (AKKA Technologies)
 * 
 */
public class ResetPasswordTestCase extends AbstractResetPasswordTestCase {

  static {
    setMediaTest(MediaType.APPLICATION_JSON);

    docAPI = new DocAPI(ResetPasswordTestCase.class, "Reset User password API with JSON format");
    docAPI.setActive(true);
    docAPI.setMediaTest(MediaType.APPLICATION_JSON);

  }

  /**
   * Default constructor
   */
  public ResetPasswordTestCase() {
    super();

  }
}
