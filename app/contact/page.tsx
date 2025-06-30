"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Mail } from "lucide-react"

export default function Contact() {
  return (
    <div className="pt-24 pb-16 bg-gradient-to-b from-blue-50 to-white min-h-screen">
      <div className="container px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-gray-900">Contact Us</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="overflow-hidden shadow-md rounded-2xl">
       <CardHeader className="bg-gradient-to-r from-blue-400 to-blue-400 text-white py-4 px-6">
  <CardTitle className="text-lg">Contact Information</CardTitle>
</CardHeader>


            <CardContent className="p-6 space-y-6 bg-white">
              <div className="flex items-start space-x-4">
                <MapPin className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Address</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Amrita Model United Nations Society,<br />
                    Amrita Vishwa Vidyapeetham<br />
                    Amritanagar<br />
                    Coimbatore - 641 112<br />
                    Tamil Nadu, India
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Mail className="w-6 h-6 text-blue-600 mt-1" />
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600">mun@cb.amrita.edu</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
