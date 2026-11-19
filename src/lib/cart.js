"use client";
import { useSyncExternalStore } from "react";

const KEY = "bazardor-cart";
const EMPTY = Object.freeze({});
const listeners = new Set();
let cache = { raw: null, value: EMPTY };

const read = () => {
  try {
    const raw = localStorage.getItem(KEY) ?? "{}";
    if (raw !== cache.raw) cache = { raw, value: JSON.parse(raw) };
    return cache.value;
  } catch {
    return EMPTY;
  }
};

const write = (next) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {}
  listeners.forEach((l) => l());
};

const subscribe = (callback) => {
  listeners.add(callback);
  window.addEventListener("storage", callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", callback);
  };
};

const round = (n) => Math.round(n * 100) / 100;

export const useCart = () => useSyncExternalStore(subscribe, read, () => EMPTY);

export const addToCart = (id, qty = 1) => {
  const cart = { ...read() };
  cart[id] = round((cart[id] ?? 0) + qty);
  write(cart);
};

export const setQty = (id, qty) => {
  const cart = { ...read() };
  if (qty > 0) cart[id] = round(qty);
  else delete cart[id];
  write(cart);
};

export const removeFromCart = (id) => setQty(id, 0);

export const clearCart = () => write({});