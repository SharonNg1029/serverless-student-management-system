import { createToaster, Toaster as ChakraToaster, Toast } from '@chakra-ui/react'
import { CheckCircle2, XCircle, AlertCircle, Info } from 'lucide-react'

export const toaster = createToaster({
  placement: 'bottom-end',
  pauseOnPageIdle: true,
})

export function Toaster() {
  return (
    <ChakraToaster toaster={toaster}>
      {(toast) => {
        const getBackgroundColor = () => {
          switch (toast.type) {
            case 'success': return '#22c55e'
            case 'error': return '#ef4444'
            case 'warning': return '#f97316'
            case 'info': return '#1f2937'
            default: return '#64748b'
          }
        }

        const getIcon = () => {
          switch (toast.type) {
            case 'success': return <CheckCircle2 size={20} />
            case 'error': return <XCircle size={20} />
            case 'warning': return <AlertCircle size={20} />
            case 'info': return <Info size={20} />
            default: return null
          }
        }

        return (
          <Toast.Root
            style={{
              position: 'relative',
              background: getBackgroundColor(),
              color: 'white',
              padding: '14px 48px 14px 16px',
              borderRadius: '8px',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2), 0 6px 10px rgba(0, 0, 0, 0.15)',
              minWidth: '400px',
              maxWidth: '500px',
              zIndex: 9999,
              pointerEvents: 'auto',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div style={{ 
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {getIcon()}
            </div>
            <div style={{ flex: 1 }}>
              {toast.title && (
                <Toast.Title style={{ 
                  fontWeight: '600', 
                  fontSize: '15px',
                  marginBottom: toast.description ? '4px' : '0',
                  color: 'white',
                  lineHeight: '1.4'
                }}>
                  {toast.title}
                </Toast.Title>
              )}
              {toast.description && (
                <Toast.Description style={{ 
                  fontSize: '13px', 
                  opacity: 0.95,
                  lineHeight: '1.5',
                  color: 'white'
                }}>
                  {toast.description}
                </Toast.Description>
              )}
            </div>
            <Toast.CloseTrigger 
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '4px',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: 'white',
                fontSize: '14px',
                transition: 'all 0.2s ease',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'
              }}
            />
          </Toast.Root>
        )
      }}
    </ChakraToaster>
  )
}


