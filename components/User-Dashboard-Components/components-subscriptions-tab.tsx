'use client'

import { CreditCardIcon } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface Subscription {
  id: number;
  name: string;
  price?: string;
  validity?: string;
}

interface SubscriptionsTabProps {
  activeSubscription: Subscription;
  availableSubscriptions: Subscription[];
}

export function SubscriptionsTab({ activeSubscription, availableSubscriptions }: SubscriptionsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriptions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Active Subscription */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Active Subscription</h3>
            <Card>
              <CardContent className="flex justify-between items-center p-4">
                <div>
                  <p className="font-medium">{activeSubscription?.name || 'No active subscription'}</p>
                  <p className="text-sm text-gray-500">Valid until: {activeSubscription?.validity || 'N/A'}</p>
                </div>
                <Badge variant="secondary">Active</Badge>
              </CardContent>
            </Card>
          </div>

          {/* Available Subscriptions */}
          <div>
            <h3 className="text-lg font-semibold mb-2">Available Subscriptions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(availableSubscriptions || []).map((sub) => (
                <Card key={sub.id}>
                  <CardHeader>
                    <CardTitle>{sub.name}</CardTitle>
                    <CardDescription>{sub.price}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button className="w-full">
                          <CreditCardIcon className="mr-2 h-4 w-4" /> Subscribe
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upgrade Subscription</DialogTitle>
                          <DialogDescription>
                            Visit the store to upgrade your subscription to {sub.name}.
                          </DialogDescription>
                        </DialogHeader>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}