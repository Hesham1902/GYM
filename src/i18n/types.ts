import type { en } from './en'

type DeepString<T> = { [K in keyof T]: T[K] extends string ? string : DeepString<T[K]> }
export type Dict = DeepString<typeof en>

type Leaves<T, P extends string = ''> = {
  [K in keyof T & (string | number)]: T[K] extends string ? `${P}${K}` : Leaves<T[K], `${P}${K}.`>
}[keyof T & (string | number)]
export type TKey = Leaves<typeof en>
