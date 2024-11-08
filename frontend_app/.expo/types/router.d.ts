/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/account` | `/catalogue` | `/create` | `/login` | `/notifications` | `/settings` | `/signup` | `/uploaded` | `/verification`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
