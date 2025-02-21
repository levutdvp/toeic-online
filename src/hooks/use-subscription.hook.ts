import { useEffect, useMemo } from "react";
import { Subscription } from "rxjs";

export function useSubscription() {
  const subscription = useMemo(() => new Subscription(), []);

  useEffect(() => () => subscription.unsubscribe(), [subscription]);

  return subscription;
}
