"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShipmentCard } from "@/components/shipment-card";
import { ServiceCard } from "@/components/service-card";
import { apiClient } from "@/utils/api";
import type { Shipment, Service, User } from "@/types/api";
import { Loader2 } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { Button } from "../ui/button";
import { SettingsCard } from "../settings-card";

const AuthManager = {
  isAuthenticated: async () => true,
};

const DEFAULT_LOCATION = {
  latitude: 48.8566,
  longitude: 2.3522, // Paris
};

export default function DeliveryServiceTabs({
  onLogout,
}: {
  onLogout: () => void;
}) {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [user, setUser] = useState<User>();
  const [shipmentsLoading, setShipmentsLoading] = useState(false);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const [shipmentsPage, setShipmentsPage] = useState(1);
  const [servicesPage, setServicesPage] = useState(1);

  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  const limit = 3;

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      getUserLocation();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated && location) {
      loadShipments(shipmentsPage, location);
    }
  }, [isAuthenticated, shipmentsPage, location]);

  useEffect(() => {
    if (isAuthenticated) {
      loadServices(servicesPage);
    }
  }, [isAuthenticated, servicesPage]);

  useEffect(() => {
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  const checkAuth = async () => {
    const authenticated = await AuthManager.isAuthenticated();
    setIsAuthenticated(authenticated);
  };

  const getUserLocation = () => {
    if (!navigator.geolocation) {
      setLocation(DEFAULT_LOCATION);
      setLocationError(
        "La géolocalisation n'est pas prise en charge par ce navigateur."
      );
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationError(null);
      },
      (error) => {
        setLocation(DEFAULT_LOCATION);
        setLocationError(
          "Impossible de récupérer la géolocalisation. Affichage des livraisons pour Paris."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const loadShipments = async (
    page: number,
    loc: { latitude: number; longitude: number }
  ) => {
    setShipmentsLoading(true);
    try {
      const filters = {
        latitude: loc.latitude,
        longitude: loc.longitude,
        radius: 50,
      };
      const response = await apiClient.fetchShipments(page, limit, filters);
      setShipments((prev) => [...prev, ...response]);
    } catch (error) {
    } finally {
      setShipmentsLoading(false);
    }
  };

  const loadProfile = async () => {
    try {
      const profile = await apiClient.fetchUserProfile();
      setUser(profile);
    } catch (error) {
      console.error("Error loading user profile:", error);
      throw error;
    }
  };

  const loadServices = async (page: number) => {
    setServicesLoading(true);
    try {
      const response = await apiClient.fetchServices(page, limit);
      setServices(response.data || []);
    } catch (error) {
      console.error("Error loading services:", error);
    } finally {
      setServicesLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentification requise</CardTitle>
            <CardDescription>
              Vous devez être connecté pour accéder à cette page.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 max-w-4xl">
      <Tabs defaultValue="shipment" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shipment">Les livraisons</TabsTrigger>
          <TabsTrigger value="service">Les prestations</TabsTrigger>
          <TabsTrigger value="settings">Paramètres</TabsTrigger>
        </TabsList>

        <TabsContent value="shipment" className="mt-6">
          <div className="space-y-4">
            {shipmentsLoading && shipments.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Chargement des livraisons...</span>
              </div>
            ) : (
              <ScrollArea>
                <div
                  className={`h-[310px] flex flex-col space-y-2${
                    shipments.length > 1 ? " mr-4" : ""
                  }`}
                >
                  {shipments.length > 0 ? (
                    shipments.map((shipment) => (
                      <ShipmentCard
                        key={shipment.shipment_id}
                        shipment={shipment}
                      />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Aucune livraison disponible pour le moment.
                    </div>
                  )}

                  {shipments.length > 2 && (
                    <div className="flex justify-center mt-4">
                      <Button
                        onClick={() => setShipmentsPage((prev) => prev + 1)}
                        disabled={shipmentsLoading}
                      >
                        {shipmentsLoading ? "Chargement..." : "Afficher plus"}
                      </Button>
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </TabsContent>

        <TabsContent value="service" className="mt-6">
          <div className="space-y-4">
            {servicesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Chargement des prestations...</span>
              </div>
            ) : (
              <ScrollArea>
                <div className="h-[310px] mr-4">
                  {services.length > 0 ? (
                    services.map((service) => (
                      <ServiceCard key={service.service_id} service={service} />
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      Aucune prestation disponible pour le moment.
                    </div>
                  )}
                </div>
              </ScrollArea>
            )}
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <ScrollArea>
            <div className="h-[310px]">
              <SettingsCard onLogout={onLogout} user={user} />
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
