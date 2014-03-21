    /*******************************************************************************
 * Copyright 2010-2014 CNES - CENTRE NATIONAL d'ETUDES SPATIALES
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
package fr.cnes.sitools.plugins.filters;

import java.util.logging.Level;

import org.restlet.data.Status;
import org.restlet.ext.wadl.MethodInfo;
import org.restlet.representation.Representation;
import org.restlet.representation.StringRepresentation;
import org.restlet.representation.Variant;
import org.restlet.resource.Put;
import org.restlet.resource.ResourceException;

import fr.cnes.sitools.common.SitoolsResource;
import fr.cnes.sitools.notification.model.Notification;

/**
 * Resource handling notifications on resource plugins
 * 
 * @author m.marseille (AKKA Technologies)
 */
public final class FilterPluginNotificationResource extends SitoolsResource {

  @Override
  public void sitoolsDescribe() {
    setName("FilterPluginNotificationResource");
    setDescription("Resource handling notifications on filter plugins");
    setNegotiated(false);
  }

  /**
   * Update / Validate existing plugin
   * 
   * @param representation
   *          plugin representation
   * @param variant
   *          client preferred media type
   * @return Representation
   */
  @Put
  public Representation notification(Representation representation, Variant variant) {
    try {
      Notification notification = null;
      if (representation != null) {
        notification = getNotificationObject(representation);
        if (notification == null) {
          getLogger().warning("FilterPluginNotification receives a null notification");
        }
      }
      // FIXME implements filter deletion if needed ?
      
      return new StringRepresentation("OK");
    }
    catch (ResourceException e) {
      getLogger().log(Level.INFO, null, e);
      throw e;
    }
    catch (Exception e) {
      getLogger().log(Level.SEVERE, null, e);
      throw new ResourceException(Status.SERVER_ERROR_INTERNAL, e);
    }
  }
  
  /**
   * Describe the Put command
   * @param info the info sent
   */
  @Override
  public void describePut(MethodInfo info) {
    info.setDocumentation("Method to handle notification from observed objects.");
    this.addStandardNotificationInfo(info);
  }
  
}
