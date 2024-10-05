"use client"

import { useState } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { KnowledgeGraphVisualization } from './knowledge-graph-visualisation';

// Placeholder for the knowledge graph visualization
const KnowledgeGraph = () => (
  <div className="w-full h-full bg-muted rounded-lg flex items-center justify-center">
    <p className="text-muted-foreground">Knowledge Graph Visualization</p>
  </div>
)

// Placeholder for the statistics component
interface StatisticsProps {
  nodes: number;
  edges: number;
  queries: number;
}

const Statistics: React.FC<StatisticsProps> = ({ nodes, edges, queries }) => (
  <div className="bg-muted p-4 rounded-lg">
    <h3 className="font-semibold mb-2">Statistics</h3>
    <ul className="space-y-1 text-sm">
      <li>Nodes: {nodes.toLocaleString()}</li>
      <li>Edges: {edges.toLocaleString()}</li>
      <li>Queries: {queries.toLocaleString()}</li>
    </ul>
  </div>
)

export function KnowledgeGraphInterface() {
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome to the Knowledge Graph interface. How can I assist you?" },
  ])
  const [input, setInput] = useState("")
  const [graphData, setGraphData] = useState({
    nodes: [
      { id: 1, label: 'Node 1' },
      { id: 2, label: 'Node 2' },
      { id: 3, label: 'Node 3' },
      { id: 4, label: 'Node 4' },
      { id: 5, label: 'Node 5' },
    ],
    edges: [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
    ],
  })
  const [queryCount, setQueryCount] = useState(0)

  const handleSend = () => {
    if (input.trim()) {
      setMessages([...messages, { role: "user", content: input }])
      setQueryCount(prevCount => prevCount + 1)
      // Simulate a response (in a real app, this would come from an API)
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "system", content: `Here's some information about "${input}"...` },
        ])
        // Here you would typically update graphData based on the API response
        // For this example, we'll just add a new node and edge
        setGraphData(prevData => ({
          nodes: [...prevData.nodes, { id: prevData.nodes.length + 1, label: `Node ${prevData.nodes.length + 1}` }],
          edges: [...prevData.edges, { from: 1, to: prevData.nodes.length + 1 }]
        }))
      }, 1000)
      setInput("")
    }
  }

  return (
    <ResizablePanelGroup direction="horizontal" className="h-screen max-h-screen">
      <ResizablePanel defaultSize={50}>
        <div className="p-4 h-full">
          <h2 className="text-lg font-semibold mb-4">Knowledge Graph</h2>
          <KnowledgeGraphVisualization data={graphData} />
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={50}>
        <div className="flex flex-col h-full">
          <div className="flex-1 p-4 flex flex-col">
            <h2 className="text-lg font-semibold mb-4">Search Interface</h2>
            <ScrollArea className="flex-1 pr-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`mb-4 ${
                    message.role === "user" ? "text-right" : "text-left"
                  }`}
                >
                  <span
                    className={`inline-block p-2 rounded-lg ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.content}
                  </span>
                </div>
              ))}
            </ScrollArea>
            <Separator className="my-4" />
            <div className="flex items-center space-x-2">
              <Input
                type="text"
                placeholder="Search the knowledge graph..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
              />
              <Button onClick={handleSend}>
                <Send className="h-4 w-4" />
                <span className="sr-only">Send</span>
              </Button>
            </div>
          </div>
          <div className="p-4 border-t">
            <Statistics 
              nodes={graphData.nodes.length} 
              edges={graphData.edges.length} 
              queries={queryCount} 
            />
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}