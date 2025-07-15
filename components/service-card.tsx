"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Code } from "lucide-react";
import type { Service } from "@/types/api";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const handleViewDetails = () => {
    window.open(
      `https://ecodeli.remythibaut.fr/services?service=${service.service_id}`,
      "_blank"
    );
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow mb-2">
      <CardHeader className="pb-2 px-3 py-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            {service.images && service.images.length > 0 ? (
              <img
                src={service.images[0] || "/placeholder.svg"}
                alt={service.name}
                className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = "none";
                  target.nextElementSibling?.classList.remove("hidden");
                }}
              />
            ) : null}
            <Code className="w-8 h-8 p-1 bg-gray-100 rounded-md hidden flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <h3 className="font-semibold text-sm leading-tight truncate">
                {service.name}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-600 mt-0.5">
                <MapPin className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{service.city}</span>
              </div>
            </div>
          </div>
          <div className="text-right flex-shrink-0 ml-2">
            <div className="text-sm font-bold text-green-600">
              {service.price}€
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0 px-3 pb-2">
        <div className="flex flex-wrap gap-1 mb-2">
          <Badge variant="secondary" className="text-xs px-1 py-0.5">
            {service.service_type}
          </Badge>
          <Badge variant="outline" className="text-xs px-1 py-0.5">
            <Clock className="w-3 h-3 mr-0.5" />
            {service.duration_time} min
          </Badge>
        </div>
        <Button onClick={handleViewDetails} className="w-full h-7 text-xs">
          Détails
        </Button>
      </CardContent>
    </Card>
  );
}
