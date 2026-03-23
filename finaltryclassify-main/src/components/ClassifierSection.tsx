import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Type, Image, Loader2, BarChart3 } from "lucide-react";
import { classifyText, CATEGORIES, SAMPLE_TEXTS, type ClassificationResult } from "@/lib/classifier";

const categoryColorMap: Record<string, string> = {
  Business: "bg-category-business/10 text-category-business border-category-business/30",
  Entertainment: "bg-category-entertainment/10 text-category-entertainment border-category-entertainment/30",
  Health: "bg-category-health/10 text-category-health border-category-health/30",
  Science: "bg-category-science/10 text-category-science border-category-science/30",
  Sports: "bg-category-sports/10 text-category-sports border-category-sports/30",
  Technology: "bg-category-technology/10 text-category-technology border-category-technology/30",
  Politics: "bg-category-politics/10 text-category-politics border-category-politics/30",
  World: "bg-category-world/10 text-category-world border-category-world/30",
  Environment: "bg-category-environment/10 text-category-environment border-category-environment/30",
  Education: "bg-category-education/10 text-category-education border-category-education/30",
};

const ClassifierSection = () => {
  const [mode, setMode] = useState<"text" | "image">("text");
  const [inputText, setInputText] = useState("");
  const [isClassifying, setIsClassifying] = useState(false);
  const [result, setResult] = useState<ClassificationResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClassify = () => {
    if (!inputText.trim()) return;
    setIsClassifying(true);
    setResult(null);

    // Simulate processing delay
    setTimeout(() => {
      const classResult = classifyText(inputText);
      setResult(classResult);
      setIsClassifying(false);
    }, 1200);
  };

  const handleSampleClick = (sample: string) => {
    setInputText(sample);
    setResult(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Simulate OCR - use filename as fallback text
    setInputText(`[Image uploaded: ${file.name}] Analyzing image content for news classification. The image appears to contain a news article that discusses current events and developments.`);
    setResult(null);
  };

  return (
    <section className="py-16 px-6">
      <div className="container mx-auto max-w-2xl">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl font-bold text-foreground leading-tight font-serif md:text-7xl text-center">
            Classify Any News Article
          </h1>
          <p className="text-muted-foreground mt-3 text-lg">
            Upload a newspaper image or paste text, AI classifies into categories instantly.
          </p>
        </motion.div>

        {/* Mode Tabs */}
        <div className="flex rounded-xl overflow-hidden border border-border mb-6">
          <button
            onClick={() => setMode("text")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
              mode === "text"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Type className="h-4 w-4" /> Paste Text
          </button>
          <button
            onClick={() => setMode("image")}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-all ${
              mode === "image"
                ? "bg-primary text-primary-foreground"
                : "bg-card text-muted-foreground hover:text-foreground"
            }`}
          >
            <Image className="h-4 w-4" /> Upload Image
          </button>
        </div>

        {/* Input */}
        {mode === "text" ? (
          <textarea
            value={inputText}
            onChange={(e) => { setInputText(e.target.value); setResult(null); }}
            placeholder="Paste or type a news article here..."
            className="w-full h-32 p-4 rounded-xl border border-border bg-card text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-32 rounded-xl border-2 border-dashed border-border bg-card flex items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
          >
            <div className="text-center">
              <Image className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">Click to upload an image</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Samples */}
        <div className="mt-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Try a sample</p>
          <div className="flex flex-wrap gap-2">
            {SAMPLE_TEXTS.map((sample, i) => (
              <button
                key={i}
                onClick={() => handleSampleClick(sample)}
                className="text-xs px-3 py-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-muted transition-colors text-left max-w-[280px] truncate"
              >
                {sample}
              </button>
            ))}
          </div>
        </div>

        {/* Classify Button */}
        <button
          onClick={handleClassify}
          disabled={!inputText.trim() || isClassifying}
          className="w-full mt-6 btn-primary-gradient py-3.5 flex items-center justify-center gap-2 text-base disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isClassifying ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Classifying...
            </>
          ) : (
            <>
              Predict Category <ArrowRight className="h-5 w-5" />
            </>
          )}
        </button>

        {/* Result */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="mt-8 card-glass p-6 rounded-2xl"
            >
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="h-5 w-5 text-primary" />
                <h3 className="font-display font-bold text-foreground">Classification Result</h3>
              </div>

              <div className="flex items-center gap-3 mb-4">
                <span className={`category-badge text-base font-bold ${categoryColorMap[result.category]}`}>
                  {result.category}
                </span>
                <span className="text-sm text-muted-foreground">
                  {result.confidence}% confidence
                </span>
              </div>

              {/* Score bars */}
              <div className="space-y-2 mb-6">
                {Object.entries(result.scores)
                  .sort(([, a], [, b]) => b - a)
                  .map(([cat, score]) => (
                    <div key={cat} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-24 text-right">{cat}</span>
                      <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${score}%` }}
                          transition={{ duration: 0.6, delay: 0.1 }}
                          className={`h-full rounded-full ${
                            cat === result.category ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8">{score}%</span>
                    </div>
                  ))}
              </div>

              {/* Explanation */}
              <div className="border-t border-border pt-4">
                <h4 className="text-sm font-semibold text-foreground mb-2">Explanation</h4>
                <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {result.explanation.split("**").map((part, i) =>
                    i % 2 === 1 ? (
                      <strong key={i} className="text-foreground">{part}</strong>
                    ) : (
                      <span key={i}>{part}</span>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-10 card-glass p-6 rounded-2xl"
        >
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">How it works</p>
          <div className="flex flex-wrap items-center gap-2 text-sm">
            {["Input Text / Upload image", "Preprocessing", "TF-IDF", "Naive Bayes", "Category"].map((step, i) => (
              <span key={step} className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-lg bg-secondary text-secondary-foreground font-medium">
                  {step}
                </span>
                {i < 4 && <span className="text-muted-foreground">→</span>}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
        <div className="mt-8">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Categories</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <span key={cat} className={`category-badge ${categoryColorMap[cat]}`}>
                {cat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ClassifierSection;
