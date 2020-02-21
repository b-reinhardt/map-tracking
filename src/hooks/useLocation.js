import { useState, useEffect } from "react";
import {
  Accuracy,
  requestPermissionsAsync,
  watchPositionAsync
} from "expo-location";

export default (shouldTrack, callback) => {
  const [err, setErr] = useState(null);
  const [subscriber, setSubscriber] = useState(null);

  const startWatching = async () => {
    const result = await requestPermissionsAsync();
    const sub = await watchPositionAsync(
      {
        accuracy: Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 10
      },
      location => {
        callback(location);
      }
    );

    setSubscriber(sub);

    if (!result.granted) {
      setErr(true);
    }
  };

  useEffect(() => {
    if (shouldTrack) {
      startWatching();
    } else {
      subscriber.remove();
      setSubscriber(null);
    }
  }, [shouldTrack]);

  return [err];
};
