import {
  rolesAllowedAdmin,
  rolesAllowedClient,
} from "@/consts/permission.const";
import { UserRole } from "@/types/permission.type";
import { BehaviorSubject } from "rxjs";

export const userRolesSubject = new BehaviorSubject<UserRole[]>([]);

class UserPermission {
  private userRoles: UserRole[] = [];

  public getUserRoles(): UserRole[] {
    return this.userRoles;
  }

  constructor() {
    userRolesSubject.subscribe((roles) => {
      if (!roles) return;

      this.userRoles = roles;
    });
  }

  public isAdmin(roles: UserRole[]) {
    return rolesAllowedAdmin.some((role) => roles.includes(role));
  }

  public isClient(roles: UserRole[]) {
    return rolesAllowedClient.some((role) => roles.includes(role));
  }
}

export const userPermission = new UserPermission();
