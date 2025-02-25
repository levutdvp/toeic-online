import React, { useEffect, useState } from "react";
import { Spin } from "antd";
import { BehaviorSubject } from "rxjs";

export const loading$ = new BehaviorSubject<number>(0);

export const showLoading = () => {
  const loading = loading$.getValue();
  const newLoading = loading + 1;

  loading$.next(newLoading);
};

export const removeLoading = () => {
  const loading = loading$.getValue();
  const newLoading = loading ? loading - 1 : 0;

  loading$.next(newLoading);
};

export const Loading: React.FC = () => {
  const [numLoading, changeNumLoading] = useState<number>(0);

  useEffect(() => {
    loading$.subscribe((data) => {
      changeNumLoading(data);
    });
  }, []);

  if (!numLoading) return <></>;

  return (
    <div className="page-loading">
      <Spin size="large" />
    </div>
  );
};
