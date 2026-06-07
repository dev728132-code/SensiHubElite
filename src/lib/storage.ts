import { SensitivityConfig, UserProfile, HistoryItem, PaymentRequest } from '../types';

// Types for our store
export interface StorageStore {
  sensitivities: SensitivityConfig[];
  history: HistoryItem[];
  payments: PaymentRequest[];
  promoCodes: any[];
}

const DEFAULT_STORE: StorageStore = {
  sensitivities: [
    {
      id: 'prem-001',
      name: 'iPhone Pro Max Elite',
      brand: 'Apple',
      model: 'iPhone 15 Pro Max',
      game: 'Free Fire',
      type: 'premium',
      plan: 'Ultra',
      general: 185,
      redDot: 198,
      scope2x: 195,
      scope4x: 192,
      sniperScope: 140,
      freeLook: 160,
      createdAt: new Date().toISOString()
    },
    {
      id: 'prem-002',
      name: 'ROG Phone 8 Ultimate',
      brand: 'ASUS',
      model: 'ROG Phone 8',
      game: 'Free Fire',
      type: 'premium',
      plan: 'Premium',
      general: 175,
      redDot: 190,
      scope2x: 188,
      scope4x: 185,
      sniperScope: 130,
      freeLook: 150,
      createdAt: new Date().toISOString()
    }
  ],
  history: [],
  payments: [],
  promoCodes: [
    { code: 'WELCOME10', type: 'discount', value: 10, status: 'active' },
    { code: 'MAXAUTO', type: 'membership', value: 'Ultra', status: 'active' }
  ]
};

// Internal helper to get/set full store
function getFullStore(): StorageStore {
  const data = localStorage.getItem('sensihub_data');
  if (!data) {
    localStorage.setItem('sensihub_data', JSON.stringify(DEFAULT_STORE));
    return DEFAULT_STORE;
  }
  return JSON.parse(data);
}

function saveStore(store: StorageStore) {
  localStorage.setItem('sensihub_data', JSON.stringify(store));
}

// Emulate Firebase SDK functions
export const db = {
  // dummy for import compatibility
};

export function collection(db: any, collectionName: string, ...rest: string[]) {
  // If we have subcollections, we just return the last part for our simple mock
  if (rest.length > 0) return rest[rest.length - 1];
  return collectionName;
}

export function collectionGroup(db: any, collectionName: string) {
  return { colName: collectionName, isGroup: true };
}

export function doc(db: any, ...pathSegments: string[]) {
  // If it's doc(db, 'col', 'id') -> db is pathSegments[0]
  // We want to extract segments from the pathSegments array
  // pathSegments[0] is collectionName, pathSegments[1] is id
  // If more segments, we join them
  
  // Real Firestore: doc(db, 'users', 'uid', 'history', 'histId')
  // For our mock, we just care about the FINAL collection and the FINAL id
  // For 'users/uid/history/histId', collection is 'history', id is 'histId'
  
  if (pathSegments.length >= 4) {
    return { collectionName: pathSegments[2], id: pathSegments[3] };
  }
  
  return { collectionName: pathSegments[0], id: pathSegments[1] };
}

export function query(q: any, ...selectors: any[]) {
  if (typeof q === 'string') {
    return { colName: q, selectors };
  }
  return { ...q, selectors };
}

export function where(field: string, op: string, value: any) {
  return { type: 'where', field, op, value };
}

export function orderBy(field: string, direction: 'asc' | 'desc' = 'asc') {
  return { type: 'orderBy', field, direction };
}

export async function getDocs(q: any) {
  const store = getFullStore();
  const colName = typeof q === 'string' ? q : q.colName;
  let data = (store as any)[colName] || [];

  // Apply basic filtering if present
  if (q.selectors) {
    for (const sel of q.selectors) {
      if (sel.type === 'where') {
        data = data.filter((item: any) => {
          if (sel.op === '==') return item[sel.field] === sel.value;
          return true;
        });
      }
    }
  }

  return {
    size: data.length,
    empty: data.length === 0,
    forEach: (callback: (doc: any) => void) => {
      data.forEach((item: any) => {
        callback({
          id: item.id,
          data: () => item
        });
      });
    },
    docs: data.map((item: any) => ({
      id: item.id,
      data: () => item
    }))
  };
}

export async function getDoc(docRef: any) {
  const store = getFullStore();
  const data = (store as any)[docRef.collectionName] || [];
  const item = data.find((i: any) => i.id === docRef.id);
  
  return {
    id: item?.id,
    exists: () => !!item,
    data: () => item
  };
}

export async function setDoc(docRef: any, data: any) {
  const store = getFullStore();
  const colName = docRef.collectionName;
  if (!(store as any)[colName]) (store as any)[colName] = [];
  
  const index = (store as any)[colName].findIndex((i: any) => i.id === docRef.id);
  if (index > -1) {
    (store as any)[colName][index] = { ... (store as any)[colName][index], ...data };
  } else {
    (store as any)[colName].push({ id: docRef.id, ...data });
  }
  
  saveStore(store);
}

export async function addDoc(colName: string, data: any) {
  const store = getFullStore();
  if (!(store as any)[colName]) (store as any)[colName] = [];
  
  const id = Math.random().toString(36).substring(2, 11);
  const newItem = { id, ...data };
  (store as any)[colName].push(newItem);
  
  saveStore(store);
  return { id };
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  console.error('Storage Error: ', { error, operationType, path });
}

export function serverTimestamp() {
  return new Date().toISOString();
}

export function arrayUnion(...elements: any[]) {
  return elements;
}

export async function deleteDoc(docRef: any) {
  const store = getFullStore();
  const colName = docRef.collectionName;
  if ((store as any)[colName]) {
    (store as any)[colName] = (store as any)[colName].filter((i: any) => i.id !== docRef.id);
    saveStore(store);
  }
}

export async function updateDoc(docRef: any, data: any) {
  await setDoc(docRef, data);
}

export function onSnapshot(q: any, callback: (snapshot: any) => void, errorCallback?: (err: any) => void) {
  const fetch = async () => {
    try {
      const snap = await getDocs(q);
      callback(snap);
    } catch (e) {
      if (errorCallback) errorCallback(e);
    }
  };
  
  fetch();
  return () => {}; 
}

export function getHistory(userId: string) {
  const store = getFullStore();
  return store.history.filter(h => h.userId === userId);
}
