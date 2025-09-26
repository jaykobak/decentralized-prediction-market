import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { CalendarIcon, Plus, Minus, Info } from "lucide-react";

export function CreateMarket() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    endDate: "",
    initialPrice: "0.50",
    minimumBet: "1",
    creatorFee: "2.5"
  });

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const categories = [
    "Crypto", "Sports", "Politics", "Technology", "Entertainment", 
    "Business", "Science", "Weather", "Gaming", "Other"
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim()) && tags.length < 5) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle market creation
    console.log("Creating market:", { ...formData, tags });
  };

  const isFormValid = formData.title && formData.description && formData.category && formData.endDate;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold mb-2">Create Prediction Market</h1>
        <p className="text-muted-foreground">
          Create a new prediction market for others to trade on. Markets are powered by BlockDAG smart contracts.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">Market Title</label>
                  <Input
                    id="title"
                    placeholder="e.g., Will Bitcoin reach $100,000 by end of 2024?"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    maxLength={120}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.title.length}/120 characters
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
                  <Textarea
                    id="description"
                    placeholder="Provide clear details about what will determine the outcome of this market..."
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                    maxLength={500}
                    rows={4}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {formData.description.length}/500 characters
                  </div>
                </div>

                {/* Category and End Date */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Category</label>
                    <select 
                      value={formData.category} 
                      onChange={(e) => handleInputChange("category", e.target.value)}
                      className="w-full px-3 py-2 bg-input-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                    >
                      <option value="">Select category</option>
                      {categories.map(category => (
                        <option key={category} value={category.toLowerCase()}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-sm font-medium mb-2">Tags (Optional)</label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      placeholder="Add tag"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      maxLength={20}
                    />
                    <Button type="button" variant="outline" onClick={addTag} disabled={tags.length >= 5}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="gap-1">
                        {tag}
                        <button
                          type="button"
                          className="ml-1 text-xs hover:text-destructive"
                          onClick={() => removeTag(tag)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {tags.length}/5 tags
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Market Parameters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="initialPrice" className="block text-sm font-medium mb-2">Initial Price (0-1)</label>
                    <Input
                      id="initialPrice"
                      type="number"
                      min="0.01"
                      max="0.99"
                      step="0.01"
                      value={formData.initialPrice}
                      onChange={(e) => handleInputChange("initialPrice", e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Starting probability for YES outcome
                    </div>
                  </div>

                  <div>
                    <label htmlFor="minimumBet" className="block text-sm font-medium mb-2">Minimum Bet (BDAG)</label>
                    <Input
                      id="minimumBet"
                      type="number"
                      min="0.1"
                      step="0.1"
                      value={formData.minimumBet}
                      onChange={(e) => handleInputChange("minimumBet", e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Minimum prediction amount
                    </div>
                  </div>

                  <div>
                    <label htmlFor="creatorFee" className="block text-sm font-medium mb-2">Creator Fee (%)</label>
                    <Input
                      id="creatorFee"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={formData.creatorFee}
                      onChange={(e) => handleInputChange("creatorFee", e.target.value)}
                    />
                    <div className="text-xs text-muted-foreground mt-1">
                      Your fee from total volume
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Market Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.title ? (
                  <div>
                    <h3 className="font-semibold mb-2">{formData.title}</h3>
                    {formData.category && (
                      <Badge variant="secondary" className="mb-2 capitalize">
                        {formData.category}
                      </Badge>
                    )}
                    {formData.description && (
                      <p className="text-sm text-muted-foreground">{formData.description}</p>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-6">
                    <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Fill out the form to see preview</p>
                  </div>
                )}

                {formData.endDate && (
                  <div className="text-sm">
                    <span className="text-muted-foreground">Ends: </span>
                    <span className="font-medium">{new Date(formData.endDate).toLocaleDateString()}</span>
                  </div>
                )}

                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="pt-2 border-t">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-center p-2 bg-green-50 rounded">
                      <div className="font-medium text-green-800">YES</div>
                      <div className="text-xs text-green-600">
                        ${formData.initialPrice}
                      </div>
                    </div>
                    <div className="text-center p-2 bg-red-50 rounded">
                      <div className="font-medium text-red-800">NO</div>
                      <div className="text-xs text-red-600">
                        ${(1 - parseFloat(formData.initialPrice)).toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Creation Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Market Creation Fee:</span>
                    <span>10 BDAG</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Initial Liquidity (recommended):</span>
                    <span>100 BDAG</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-medium">
                      <span>Total:</span>
                      <span>110 BDAG</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Button type="submit" className="w-full" disabled={!isFormValid}>
              Create Market
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              By creating a market, you agree to our terms of service and market resolution policies.
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}