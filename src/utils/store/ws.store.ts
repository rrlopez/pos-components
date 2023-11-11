import _ from 'lodash';
import { toast } from 'react-hot-toast';
import 'regenerator-runtime/runtime';
import { v4 as uuid } from 'uuid';
import { create } from 'zustand';
import { addPrintJob, log, onInteractApp, timeout } from '..';
import { queryClient } from '../../App';
import { getConfigs } from '../../api';
import useAuth from '../../auth/auth.store';
import { ErrorPrompt, LoadingPrompt } from '../../components/dialog/Prompt';
import { delModal, showModal } from '../Overlay';
import { getLocalStorage } from '../hooks/useLocalStorage';
import { getStoreStateSetter } from './utils';

const onReconnect = _.debounce(async state => {
  const promptId = await showModal(LoadingPrompt, {
    label: 'Reconnecting...',
    description: 'The browser has timed out and lost some connection to server.',
  })

  const handleError = () => {
    delModal(promptId)
    onInteractApp(() => document.location.reload())
    showModal(ErrorPrompt, {
      key: 'wsError',
      description: `The browser has failed to restore connection to server. \r\nPlease refresh the page to resolve.`,
      onClick: () => document.location.reload(),
      btnTxt: 'Reload Page',
    })
    clearTimeout(timer)
  }

  const timer = setTimeout(handleError, 15000)

  state.connect(state, {
    onOpen: () => {
      clearTimeout(timer)
      timeout(() => {
        delModal(promptId)
        toast.success('WS Successfully Reconnected.\nPlease Feel Free To Continue.')
      }, 1000)
    },
    onError: handleError,
  })
}, 250)

const useWS = create((set: any, get: any) => ({
  // STATES
  ws: null,
  uuid: null,
  userId: null,
  error: '',
  import_progress: 0,
  ebay_progress: 0,
  shopify_progress: 0,
  etsy_progress: 0,
  batch_print_progress: 0,
  update_progress: 0,

  // GETTERS
  computed: {
    get getImportSubscription() {
      const state = get()
      if (state.error || !state.ws) return state.reconnect()
      return state.ws.getSubscription(`import:${state.userId}`)
    },
    get getEbaySubscription() {
      const state = get()
      if (state.error || !state.ws) return state.reconnect()
      return state.ws.getSubscription(`ebay:${state.userId}`)
    },
    get getEtsySubscription() {
      const state = get()
      if (state.error || !state.ws) return state.reconnect()
      return state.ws.getSubscription(`etsy:${state.userId}`)
    },
    get getShopifySubscription() {
      const state = get()
      if (state.error || !state.ws) return state.reconnect()
      return state.ws.getSubscription(`shopify:${state.userId}`)
    },
    get getBatchPrintSubscription() {
      const state = get()
      if (state.error || !state.ws) return state.reconnect()
      return state.ws.getSubscription(`batchPrint:${state.userId}`)
    },
    get getUpdateSubscription() {
      const state = get()
      if (state.error || !state.ws) return state.reconnect()
      return state.ws.getSubscription(`update:${state.userId}`)
    },
    get getWS() {
      const state = get()
      if (state.error || !state.ws) return state.reconnect()
      return state.ws
    },
    get getImportProgress() {
      const state = get()
      if (state.error || !state.ws) return { error: state.error || 'WS not set yet' }
      let progress_label = ''
      if (state.import_progress <= 25) progress_label = 'Initializing Upload'
      else if (state.import_progress <= 50) progress_label = 'Reviewing Data'
      else if (state.import_progress <= 75) progress_label = 'Retrieving USPS Rates'
      else progress_label = 'Finalizing Orders'
      return { value: state.import_progress, label: progress_label }
    },
    get getEtsyProgress() {
      const state = get()
      if (state.error || !state.ws) return { error: state.error || 'WS not set yet' }
      let progress_label = ''
      if (state.etsy_progress < 20) progress_label = 'Initializing'
      else if (state.etsy_progress < 89) progress_label = 'Filtering Etsy orders that are ready to ship'
      else if (state.etsy_progress < 91) progress_label = 'Computing Rates'
      else if (state.etsy_progress > 90) progress_label = 'Finalizing'
      return { value: state.etsy_progress, label: progress_label }
    },
    get getEbayProgress() {
      const state = get()
      if (state.error || !state.ws) return { error: state.error || 'WS not set yet' }
      let progress_label = ''
      if (state.ebay_progress < 20) progress_label = 'Initializing'
      else if (state.ebay_progress < 89) progress_label = 'Filtering last 14 days of eBay orders that are ready to ship'
      else if (state.ebay_progress < 91) progress_label = 'Computing Rates'
      else if (state.ebay_progress > 90) progress_label = 'Finalizing'
      return { value: state.ebay_progress, label: progress_label }
    },
    get getShopifyProgress() {
      const state = get()
      if (state.error || !state.ws) return { error: state.error || 'WS not set yet' }
      let progress_label = ''
      if (state.shopify_progress < 11) progress_label = 'Initializing'
      else if (state.shopify_progress < 81) progress_label = 'Filtering last 60 days of shopify orders that are ready to ship'
      else if (state.shopify_progress < 91) progress_label = 'Processing Rates'
      else if (state.shopify_progress > 90) progress_label = 'Finalizing'
      return { value: state.shopify_progress, label: progress_label }
    },
    get getBatchPrintProgress() {
      const state = get()
      if (state.error || !state.ws) return { error: state.error || 'WS not set yet' }
      let progress_label = ''
      if (state.batch_print_progress < 90) progress_label = 'Processing Request'
      else if (state.batch_print_progress < 11) progress_label = 'Initializing'
      else progress_label = 'Finalizing'
      return { value: state.batch_print_progress, label: progress_label, summary: state.batch_print_summary }
    },
    get getUpdateProgress() {
      const state = get()
      if (state.error || !state.ws) return { error: state.error || 'WS not set yet' }
      let progress_label = ''
      if (state.update_progress <= 80) progress_label = 'Processing records, getting rates'
      else if (state.update_progress > 80) progress_label = 'Finalizing'
      return { value: state.update_progress, label: progress_label, summary: state.update_label_summary }
    },
  },
  // ACTIONS
  async connect(state: any = get(), cb: any = {}) {
    if (!state.ws) {
      log('SETTING WS')
      const { user }:any = useAuth.getState()
      const wsURL = `${process.env.APP_MIX_WS}`
      const WS = require('@adonisjs/websocket-client')
      const ws = WS(wsURL, { path: 'ws' })
      try {
        ws.connect()
        ws.on('open', () => {
          log('ws open')
          const newState = { ...get(), ws, uuid: state.uuid, userId: user.id, error: '' }
          set(() => newState)
          newState.subscribe(newState, true)
          cb.onOpen?.()
        })
        ws.on('error', () => {
          set((state: any) => ({ ...state, error: 'Unable to connect to ws' }))
          cb.onError?.()
        })
      } catch (e: any) {
        set((state: any) => ({ ...state, error: 'Unable to connect to ws' }))
        cb.onError?.()
      }
    }
  },
  reconnect() {
    const state = get()
    onReconnect({...state, ...getLocalStorage('uuid', {uuid: uuid()})})
    return {error: state.error ||  "WS not set yet"}
  },
  async subscribe(state: any = get(), isReconnected: boolean) {
    if (state.error || !state.ws) return state.reconnect()

    // no user yet, meaning no subscription made yet
    if (state.ws || isReconnected) {
      await Promise.all([
        state.subscribeTo('ETSY'),
        state.subscribeTo('EBAY'),
        state.subscribeTo('SHOPIFY'),
        state.subscribeTo('BATCH'),
        state.subscribeTo('IMPORT'),
        state.subscribeTo('UPDATE'),
      ])
    }
    return null
  },
  async subscribeTo(kind = null, state = get()) {
    if (state.error || !state.ws) return state.reconnect()
    if (kind) {
      switch (kind) {
        case 'IMPORT':
          const importChan = state.ws.subscribe(`import:${state.userId}`)
          log('import channel ', importChan)
          // importChan.on('progress', async (p: any) => {
          //   state.setState((state: any) => {
          //     state.import_progress = state.import_progress + p
          //   })
          // })
          // importChan.on('done', async () => {
          //   state.setState({ import_progress: null })
          //   queryClient.refetchQueries({ queryKey: 'validCounts', exact: true })
          // })

          // importChan.on('error', async () => {
          //   toast.error('Unable To Process Import')
          // })
          break
        case 'EBAY':
          const ebayChan = state.ws.subscribe(`ebay:${state.userId}`)
          log('ebay channel ', ebayChan)
          ebayChan.on('sync', async (p: any) => {
            state.setState((state: any) => {
              state.ebay_progress = state.ebay_progress + p
            })
          })
          ebayChan.on('ebay_sync_done', async () => {
            state.setState({ ebay_progress: null })
            toast.success(`Ebay Sync Successfully`)
          })
          ebayChan.on('ebay_error', (error: any) => {
            toast.error(error.message || 'Failed to sync')
            state.setState({ ebay_progress: null })
          })
          break
        case 'ETSY':
          const etsyChan = state.ws.subscribe(`etsy:${state.userId}`)
          log('etsy channel ', etsyChan)
          etsyChan.on('sync', async (p: any) => {
            state.setState((state: any) => {
              state.etsy_progress = state.etsy_progress + p
            })
          })
          etsyChan.on('etsy_sync_done', async () => {
            state.setState({ etsy_progress: null })
            toast.success(`Etsy Sync Successfully`)
          })
          etsyChan.on('etsy_error', (error: any) => {
            toast.error(error.message || 'Failed to sync')
            state.setState({ etsy_progress: null })
          })
          break
        case 'SHOPIFY':
          const shopifyChan = state.ws.subscribe(`shopify:${state.userId}`)
          shopifyChan.on('sync', async (p: any) => {
            state.setState((state: any) => {
              state.shopify_progress = state.shopify_progress + p
            })
          })
          shopifyChan.on('shopify_sync_done', async () => {
            state.setState({ shopify_progress: null })
            toast.success(`Shopify Sync Successfully`)
          })
          shopifyChan.on('shopify_error', (error: any) => {
            toast.error(error.message || 'Failed to sync')
            state.setState({ shopify_progress: null })
          })
          break
        case 'BATCH':
          const batchPrintChan = state.ws.subscribe(`batchPrint:${state.userId}`)
          batchPrintChan.on('progress', async (p: any) => {
            state.setState((state: any) => {
              state.batch_print_progress = state.batch_print_progress + p
            })
          })
          batchPrintChan.on('batch_data', async ({ base64, errors, ...args }: any) => {
            // feed label to printer
            if (errors.length > 0) toast.error(errors[0].name)
            else if (base64 !== null) {
              log('with base64, printing label')
              addPrintJob({ label: base64 })
            }
            state.setState({ batch_print_summary: args })
          })
          batchPrintChan.on('batch_print_done', () => {
            state.setState({ batch_print_progress: null })
            queryClient.refetchQueries({ queryKey: 'eCommerceStore', exact: true })
            queryClient.refetchQueries({ queryKey: 'importOrder', exact: true })
            queryClient.refetchQueries({ queryKey: 'needReviewOrder', exact: true })
            queryClient.refetchQueries({ queryKey: 'validCounts', exact: true })
            queryClient.refetchQueries({ queryKey: 'labelHistory', exact: true })
            queryClient.refetchQueries({ queryKey: 'scanFormContent', exact: true })
          })
          batchPrintChan.on('batch_error', async (data: any) => {
            toast.error('batch error', data)
            state.setState({ batch_print_progress: null })
          })
          break
        case 'UPDATE':
          const updateChan = state.ws.subscribe(`update:${state.userId}`)
          log('update channel ', updateChan)
          // updateChan.on('progress', async (p: any) => {
          //   state.setState((state: any) => {
          //     state.update_progress = state.update_progress + p
          //   })
          // })

          // updateChan.on('done', async () => {
          //   state.setState({ batch_print_progress: null })
          //   // dispatch('refreshNotification', null, {root: true})
          // })

          // updateChan.on('error', async (error: any) => {
          //   toast.error('Unable To Process Update', error.message)
          // })
          break
      }
    }
    return null
  },

  //SYNC INTEG
  syncShopifyStore(id:any, {onDone}:any) {
    const state = get()
    const shopifyChan = state.computed.getShopifySubscription
    shopifyChan.emit("refresh", {id, header: getConfigs() });
    shopifyChan.on("shopify_sync_done", onDone);
    shopifyChan.on("shopify_error", onDone);
  },
  syncEbayStore(id:any, {onDone}:any) {
    const state = get()
    const eBayChan = state.computed.getEbaySubscription
    eBayChan.emit("refresh", {id, header: getConfigs() });
    eBayChan.on("ebay_sync_done", onDone);
    eBayChan.on("ebay_error", onDone);
  },
  syncEtsyStore(id:any, {onDone}:any) {
    const state = get()
    const etsyChan = state.computed.getEtsySubscription
    etsyChan.emit("refresh", {id, header: getConfigs() });
    etsyChan.on("etsy_sync_done", onDone);
    etsyChan.on("etsy_error", onDone);
  },

  // MUTATION
  setState: getStoreStateSetter(set),
}))

export default useWS
