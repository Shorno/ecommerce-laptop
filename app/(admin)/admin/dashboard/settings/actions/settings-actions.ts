"use server"

import {db} from "@/db/config"
import {storeSetting} from "@/db/schema/store-setting"
import {eq} from "drizzle-orm"
import {checkAuth} from "@/app/actions/auth/checkAuth"

// ─── Get all settings as a map ───
export async function getAllSettings(): Promise<Record<string, string>> {
    try {
        const rows = await db.select().from(storeSetting)
        const result: Record<string, string> = {}
        for (const row of rows) {
            result[row.key] = row.value
        }
        return result
    } catch (error) {
        console.error("Error fetching settings:", error)
        return {}
    }
}

// ─── Update multiple settings at once ───
export async function updateSettings(settings: Record<string, string>): Promise<{
    success: boolean
    error?: string
}> {
    try {
        const session = await checkAuth()
        if (session.user.role !== "admin") {
            return {success: false, error: "Unauthorized"}
        }

        const entries = Object.entries(settings)

        // Upsert each setting
        for (const [key, value] of entries) {
            const existing = await db
                .select()
                .from(storeSetting)
                .where(eq(storeSetting.key, key))
                .limit(1)

            if (existing.length > 0) {
                await db
                    .update(storeSetting)
                    .set({value, updatedAt: new Date()})
                    .where(eq(storeSetting.key, key))
            } else {
                await db
                    .insert(storeSetting)
                    .values({key, value})
            }
        }

        return {success: true}
    } catch (error) {
        console.error("Error updating settings:", error)
        return {success: false, error: "Failed to update settings"}
    }
}
