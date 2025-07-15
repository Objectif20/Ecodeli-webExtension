"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MapPin, Clock, Weight } from "lucide-react";
import type { Shipment } from "@/types/api";

interface ShipmentCardProps {
  shipment: Shipment;
}

export function ShipmentCard({ shipment }: ShipmentCardProps) {
  const handleViewDetails = () => {
    window.open(
      `https://ecodeli.remythibaut.fr/deliveries/${shipment.shipment_id}`,
      "_blank"
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow mb-2">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {shipment.image ? (
              <img
                src={shipment.image || "/placeholder.svg"}
                alt={shipment.description}
                className="w-12 h-12 rounded-lg object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <Package className="w-12 h-12 p-2 bg-gray-100 rounded-lg hidden" />
            <div>
              <h3 className="font-semibold text-lg leading-tight">
                {shipment.description}
              </h3>
              <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4" />
                <span>
                  {shipment.departure_city} - {shipment.arrival_city}
                </span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold text-green-600">
              {shipment.proposed_delivery_price}€
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="secondary" className="text-xs">
            <Weight className="w-3 h-3 mr-1" />
            {shipment.weight} kg
          </Badge>
          <Badge
            variant={shipment.urgent ? "destructive" : "outline"}
            className="text-xs"
          >
            {shipment.urgent ? "Urgent" : "Non-urgent"}
          </Badge>
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            {formatDate(shipment.deadline_date)}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <Button onClick={handleViewDetails} className="w-full">
            Détails
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
