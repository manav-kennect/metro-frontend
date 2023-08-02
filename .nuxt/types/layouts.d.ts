import { ComputedRef, Ref } from 'vue'
export type LayoutKey = "blank" | "default" | "error"
declare module "C:/Users/it_ad/Kennect/metro-frontend/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    layout?: false | LayoutKey | Ref<LayoutKey> | ComputedRef<LayoutKey>
  }
}