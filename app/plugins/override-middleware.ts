export default defineNuxtPlugin(() => {
    addRouteMiddleware('manifest-route-rule', () => {
        // Implementation can be empty or minimal
    }, { override: true })
})