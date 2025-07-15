"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import type { User } from "@/types/api";
import { Badge } from "./ui/badge";
import {
  CheckCircle,
  Crown,
  Mail,
  LogOut,
  Sun,
  Moon,
  ExternalLink,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface ProfileCardProps {
  user: User | undefined;
  onLogout: () => void;
}

export function SettingsCard({ user, onLogout }: ProfileCardProps) {
  const handleProfileRedirect = () => {
    window.open("https://ecodeli.remythibaut.fr/office/profile", "_blank");
  };

  if (!user) {
    return (
      <Card className="w-full">
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground mb-4">
            Aucun utilisateur connecté.
          </p>
          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={onLogout}
              className="flex-1"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getInitials = (firstName: string, lastName: string) =>
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();

  const getPlanBadge = (planName?: string, upgradable?: boolean) => {
    if (!planName) return null;

    return (
      <Badge
        variant={upgradable ? "outline" : "default"}
        className={
          upgradable
            ? "border-orange-300 text-orange-700"
            : "bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900 dark:text-blue-200"
        }
      >
        <Crown className="w-3 h-3 mr-1" />
        {planName}
        {upgradable && " (Évolutif)"}
      </Badge>
    );
  };

  return (
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          <Avatar className="w-12 h-12">
            <AvatarImage
              src={user.photo || undefined}
              alt={`${user.first_name} ${user.last_name}`}
            />
            <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold dark:bg-blue-900 dark:text-blue-200">
              {getInitials(user.first_name, user.last_name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-bold text-foreground truncate">
              {user.first_name} {user.last_name}
            </CardTitle>
            {user.validateProfile && (
              <Badge
                variant="default"
                className="bg-green-100 text-green-800 hover:bg-green-100 mt-1 inline-flex items-center text-xs dark:bg-green-900 dark:text-green-200"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Vérifié
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3 pt-0">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Mail className="w-4 h-4 flex-shrink-0" />
          <span className="text-sm truncate">{user.email}</span>
        </div>

        {user.planName && (
          <div className="flex justify-start">
            {getPlanBadge(user.planName, user.updgradablePlan)}
          </div>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button
            variant="outline"
            size="sm"
            onClick={handleProfileRedirect}
            className="flex-1 bg-transparent"
            title="Accéder à mon profil"
          >
            Mon profil
            <ExternalLink className="w-4 h-4" />
          </Button>

          <Button
            variant="destructive"
            size="sm"
            onClick={onLogout}
            className="flex-1"
            title="Déconnexion"
          >
            Déconnexion
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}
