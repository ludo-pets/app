export const activeItemsImage = (activeItems: Record<string, string>, purchasedItems: { itemId: string; image?: string }[]) => {
    const activeItemsWithImages: Record<string, string | null> = {}
    Object.entries(activeItems).forEach(([slot, itemId]) => {
        const purchase = purchasedItems.find((pi) => pi.itemId === itemId)
        activeItemsWithImages[slot] = purchase ? purchase.image || null : null
    })
    return activeItemsWithImages
}
