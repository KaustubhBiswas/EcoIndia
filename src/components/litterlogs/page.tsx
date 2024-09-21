"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarIcon, ImageIcon, MapPinIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"

interface LitterLog {
  _id: string
  location: {
    coordinates: [number, number]
  }
  imageUrl: string
  isDeleted: boolean
  timestamp: string
  __v: number
}

export default function LitterLogsTable() {
  const [litterLogs, setLitterLogs] = useState<LitterLog[]>([])
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLitterLogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/litterlogs/getalllitterlogs")
        if (!response.ok) {
          throw new Error("Failed to fetch litter logs")
        }
        const data = await response.json()
        setLitterLogs(data)
      } catch (error) {
        console.error("Error fetching litter logs:", error)
      }
      finally {
        setIsLoading(false);
      }
    }

    fetchLitterLogs()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const formatCoordinates = (coordinates: [number, number]) => {
    return `${coordinates[0].toFixed(4)}, ${coordinates[1].toFixed(4)}`
  }

  const SkeletonRow = () => (
    <TableRow className="hover:bg-gray-800">
      <TableCell>
        <div className="flex items-center">
          <MapPinIcon className="w-4 h-4 mr-2 text-green-400"/>
          <div className="h-4 w-24 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <ImageIcon className="w-4 h-4 mr-2 text-green-400"/>
          <div className="h-4 w-20 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          <CalendarIcon className="w-4 h-4 mr-2 text-green-400" />
          <div className="h-4 w-32 bg-gray-700 rounded animate-pulse"></div>
        </div>
      </TableCell>
    </TableRow>
  )

  return (
    <Card className="w-full max-w-4xl mx-auto bg-gray-900 text-white">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center text-green-400">Litter Logs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-green-400">Location</TableHead>
              <TableHead className="text-green-400">Image</TableHead>
              <TableHead className="text-green-400">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
        </Table>
        <ScrollArea className="h-[150px] overflow-auto">
          <Table>
            <TableBody>
              {isLoading ? (
                <>
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                  <SkeletonRow />
                </>
              ) : (
                litterLogs.map((log) => (
                  <TableRow key={log._id} className="hover:bg-gray-800">
                    <TableCell>
                      <div className="flex items-center">
                        <MapPinIcon className="w-4 h-4 mr-2 text-green-400" />
                        {formatCoordinates(log.location.coordinates)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ImageIcon className="w-4 h-4 mr-2 text-green-400" />
                        <a href={log.imageUrl} target="_blank" rel="noopener noreferrer" className="text-green-400 hover:underline">
                          View Image
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <CalendarIcon className="w-4 h-4 mr-2 text-green-400" />
                        {formatDate(log.timestamp)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}