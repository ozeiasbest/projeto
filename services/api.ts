import { API_URL } from '../constants';
import { RawUnitData, UnitData } from '../types';

const cleanValue = (val: string | undefined): string => {
  if (!val) return "";
  const strVal = String(val).trim();
  // Filter out common spreadsheet error values
  if (['#N/A', '#REF!', '#VALUE!', '#DIV/0!', '#NAME?'].includes(strVal)) return "";
  return strVal;
};

export const fetchCondoData = async (): Promise<UnitData[]> => {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    
    const rawData = await response.json();
    
    const mapItem = (item: RawUnitData, index: number): UnitData => ({
        id: `unit-${index}`,
        blockApt: cleanValue(item["BLOCO e APT"]) || "N/A",
        name: cleanValue(item["Nomes"]) || "Sem registro",
        plate: cleanValue(item["Placa"]),
        phone: cleanValue(item["Telefone 📞"]),
        carModel: cleanValue(item["Carro - modelo 🚘"]),
        sticker: cleanValue(item["ADESIVO DE IDENTIFICAÇÃO"]),
        observations: cleanValue(item["Observações 📋"]),
        rentedSpotObs: cleanValue(item["OBS VAGAS ALUGADAS"])
    });
    
    // Normalize data structure
    if (Array.isArray(rawData)) {
        return rawData.map(mapItem);
    } else if (rawData && rawData.data && Array.isArray(rawData.data)) {
        // Handle potential wrapper object case
        return rawData.data.map(mapItem);
    }
    
    return [];
  } catch (error) {
    console.error("Failed to fetch data:", error);
    throw error;
  }
};