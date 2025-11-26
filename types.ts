import React from 'react';

export interface RawUnitData {
  "BLOCO e APT"?: string;
  "Nomes"?: string;
  "Placa"?: string;
  "Telefone 📞"?: string;
  "Carro - modelo 🚘"?: string;
  "ADESIVO DE IDENTIFICAÇÃO"?: string;
  "Observações 📋"?: string;
  "OBS VAGAS ALUGADAS"?: string;
  [key: string]: string | undefined;
}

export interface UnitData {
  id: string; // generated unique id
  blockApt: string;
  name: string;
  plate: string;
  phone: string;
  carModel: string;
  sticker: string;
  observations: string;
  rentedSpotObs: string;
}

export enum Page {
  DASHBOARD = 'DASHBOARD',
  SEARCH = 'SEARCH'
}

export enum FilterType {
  ALL = 'ALL',
  VEHICLES = 'VEHICLES',
  RENTED_SPOTS = 'RENTED_SPOTS',
  OBSERVATIONS = 'OBSERVATIONS'
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  colorClass: string;
  onClick?: () => void;
}