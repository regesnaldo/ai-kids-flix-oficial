import { motion } from "framer-motion";
import { useThemeMode } from "@/contexts/ThemeModeContext";
import { Play } from "lucide-react";
import { useState } from "react";

interface NetflixCardProps {
  title: string;
  thumbnail: string;
  rating: number;
  seasonNumber?: number;
}

export function NetflixCard({
  title,
  thumbnail,
  rating,
  seasonNumber,
}: NetflixCardProps) {
  const { mode, config } = useThemeMode();
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const getCardAnimation = () => {
    switch (mode) {
      case "kids":
        return {
          initial: { scale: 1, rotate: 0 },
          hover: { scale: 1.15, rotate: 2 },
          transition: { type: "spring" as const, stiffness: 400, damping: 10 },
        };
      case "teens":
        return {
          initial: { scale: 1 },
          hover: { scale: 1.1 },
          transition: { duration: 0.3 },
        };
      case "adults":
        return {
          initial: { scale: 1 },
          hover: { scale: 1.12 },
          transition: { duration: 0.4 },
        };
    }
  };

  const animation = getCardAnimation();

  // Imagens de IA futuristas
  const aiImages = [
    "https://private-us-east-1.manuscdn.com/sessionFile/m7YclxBokDFJE7odLUUuHA/sandbox/W0I160N6b9ZmBck6IUHIl9-img-1_1770158872000_na1fn_YWktbmV1cmFsLW5ldHdvcms.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbTdZY2x4Qm9rREZKRTdvZExVVXVIQS9zYW5kYm94L1cwSTE2ME42YjlabUJjazZJVUhJbDktaW1nLTFfMTc3MDE1ODg3MjAwMF9uYTFmbl9ZV2t0Ym1WMWNtRnNMVzVsZEhkdmNtcy5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=EeO4HowlqS1f6TlTAUs7Vvak1e2-y~NX5~qa0kp8GfkM2ngtZSixiTd1SjO9qv-gp0QQtH7jnQEmfzbCpyGb0Kr1il6yP7629ySNQlz8hlPFjpayi5DIT~XZWLdbvX2VtYs2L4ewNM4ysf5ZUiSDfLrKcmntdzCDrWAr9SJ~1RhC3EdEDvjnayugiPgMn~~Qs1ZWdZMEhX~L2GxU~kF0t~-9uRwqK1KJU9P1y1z0vDtxXfqxhtEalKHGBHmICL69uL8DevCDzzEDOQCOUGFmsXsN6oJBDJXiIXZUl9RK3wOuforQvTjXj8rHjOvxtFoMQhRfKwMmRjWfiEzYM6J8NA__",
    "https://private-us-east-1.manuscdn.com/sessionFile/m7YclxBokDFJE7odLUUuHA/sandbox/W0I160N6b9ZmBck6IUHIl9-img-2_1770158853000_na1fn_YWktZGF0YS1mbG93.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbTdZY2x4Qm9rREZKRTdvZExVVXVIQS9zYW5kYm94L1cwSTE2ME42YjlabUJjazZJVUhJbDktaW1nLTJfMTc3MDE1ODg1MzAwMF9uYTFmbl9ZV2t0WkdGMFlTMW1iRzkzLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=TAk~bKBiE0eEd4XfpJt93YMUEFKERnDaHKMnszGVsUpZC3wLP5mjriygWV4QsGxw2QWD29DgkZpYOrNJC9ntfGod3w9nopwpMVTzB4-K4-aAx1yL0OpsU5a9p3kfK7oqpCZ21Z47soJiS5xl5d39zK9rMNOzfr0pmFOAEpTR-R3-FXG7zoiRcUY1rFTKnwjDhLyEL-AOYiJ3SaPGSLJh1x2oGqeu2nAh5YV0qomnUgT1ZmG2~InMsA2dsOYlN4uy8nFcjDU~u5Msrk3gwix06JzJxYycWmOriVsyUuMnpd15fzWSAvTzmf8IqPFEi~g38JsL~Ldhr9PqVbxG1mzLkQ__",
    "https://private-us-east-1.manuscdn.com/sessionFile/m7YclxBokDFJE7odLUUuHA/sandbox/W0I160N6b9ZmBck6IUHIl9-img-3_1770158870000_na1fn_YWktZGlnaXRhbC1taW5k.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbTdZY2x4Qm9rREZKRTdvZExVVXVIQS9zYW5kYm94L1cwSTE2ME42YjlabUJjazZJVUhJbDktaW1nLTNfMTc3MDE1ODg3MDAwMF9uYTFmbl9ZV2t0WkdsbmFYUmhiQzF0YVc1ay5wbmc~eC1vc3MtcHJvY2Vzcz1pbWFnZS9yZXNpemUsd18xOTIwLGhfMTkyMC9mb3JtYXQsd2VicC9xdWFsaXR5LHFfODAiLCJDb25kaXRpb24iOnsiRGF0ZUxlc3NUaGFuIjp7IkFXUzpFcG9jaFRpbWUiOjE3OTg3NjE2MDB9fX1dfQ__&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=PblwHmoTbLdXGWjxzAmvjcPT14exr4slR1Ldus3QI7UBLUqsO3OQkuYEcDwHzv1jcOh98-adt4WEozxIFdkoV96FZooqaiAjElXU7FFfk6~cM8tMqdNVsKTGSJCbFHbaPgfdY90s90p4mcSqh62D8dCRggtVWXMbgDgJmG9bTTk2wPRltTfeRydIwK6IwUo0sVlUIIComEnyvCFhajZfpppfX6mpg3rE3WcHOB1u-KrZ9Pyij6RiaaAndjGs08KcmN8KPEExJ2VdwJzcB5y3PUwW67gB8Qs4uPho28mjLUJt~nFQLbYkmGK3JiyJGhMDy4XZF8p~4KhiVd99BfMhjw__",
    "https://private-us-east-1.manuscdn.com/sessionFile/m7YclxBokDFJE7odLUUuHA/sandbox/W0I160N6b9ZmBck6IUHIl9-img-4_1770158862000_na1fn_YWktcXVhbnR1bS1jb21wdXRpbmc.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbTdZY2x4Qm9rREZKRTdvZExVVXVIQS9zYW5kYm94L1cwSTE2ME42YjlabUJjazZJVUhJbDktaW1nLTRfMTc3MDE1ODg2MjAwMF9uYTFmbl9ZV2t0Y1hWaGJuUjFiUzFqYjIxd2RYUnBibWMucG5nP3gtb3NzLXByb2Nlc3M9aW1hZ2UvcmVzaXplLHdfMTkyMCxoXzE5MjAvZm9ybWF0LHdlYnAvcXVhbGl0eSxxXzgwIiwiQ29uZGl0aW9uIjp7IkRhdGVMZXNzVGhhbiI6eyJBV1M6RXBvY2hUaW1lIjoxNzk4NzYxNjAwfX19XX0_&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=NVHftJRHDojSFZBXSIE5uBXuJU94wwLhdcJKcKNf5LIr0BRE2i9AnkpQ6tQMN~Aoy~MmEuNrQc2EMcQZVzHlUZs8H3u47VPz4SPe7vCE4DOjZjfILzK2eZWtMqr3TWjp~OZlqjQRHgmlkZSQwuZ4PKeRiUGlWSMYMlySZrQwm~7wRshkyBWTH7xhkvSjfq5zABKGGZHIg-o2hXN2U1ad4F4bS~WJfNR4qBuUhpZpw8XdCsNtrONBn9Mdx23eFxuxMFoztJEhOoGhFqs1jf00h72fpyy8PYPZFr1zjrxEKL5ol5R55kLVKEXTR7iMrliBNOE1-KtRxpG8GRz4O1T5tg__",
    "https://private-us-east-1.manuscdn.com/sessionFile/m7YclxBokDFJE7odLUUuHA/sandbox/W0I160N6b9ZmBck6IUHIl9-img-5_1770158866000_na1fn_YWktZnV0dXJlLXRlY2g.png?x-oss-process=image/resize,w_1920,h_1920/format,webp/quality,q_80&Expires=1798761600&Policy=eyJTdGF0ZW1lbnQiOlt7IlJlc291cmNlIjoiaHR0cHM6Ly9wcml2YXRlLXVzLWVhc3QtMS5tYW51c2Nkbi5jb20vc2Vzc2lvbkZpbGUvbTdZY2x4Qm9rREZKRTdvZExVVXVIQS9zYW5kYm94L1cwSTE2ME42YjlabUJjazZJVUhJbDktaW1nLTVfMTc3MDE1ODg2NjAwMF9uYTFmbl9ZV2t0Wm5WMGRYSmxMWFJsWTJnLnBuZz94LW9zcy1wcm9jZXNzPWltYWdlL3Jlc2l6ZSx3XzE5MjAsaF8xOTIwL2Zvcm1hdCx3ZWJwL3F1YWxpdHkscV84MCIsIkNvbmRpdGlvbiI6eyJEYXRlTGVzc1RoYW4iOnsiQVdTOkVwb2NoVGltZSI6MTc5ODc2MTYwMH19fV19&Key-Pair-Id=K2HSFNDJXOU9YS&Signature=bx4jtEfE-D3WOwyqNuXx9xJio5zCjDVcVivNK0f4ComrVUpZ5Ujo5ppbnf5~MkXFgncCfcWk9g0BpLu2aK-eFTYroejT5bkHBu77wyixBDpOh0efQ3U~f3LQ8QOJRYPyJyYoM3CzsBI3bdYiLNXrlvujMvZshymxr9aF3rRjKjD5BNfO8J2pp3z7~O4uJJhrfaXhZqrmz~tFifDqSAuXzm8PW5H6UhE~Yt1G40DuEt0JbZKrFze-MdrzBZtH~mkTPXgZOgyUGgqJY6xaLB5z-dIwEgKZmPTOrBeSYH7P6ySO07jUfkiVNbJPjWokvO0bBn4tA3wIZHipNpRjKZ2A2g__",
  ];

  const randomImage = aiImages[Math.floor(Math.random() * aiImages.length)];
  const displayImage = mode === "kids" ? thumbnail : randomImage;

  return (
    <motion.div
      className="relative w-full h-64 rounded-lg overflow-hidden cursor-pointer flex-shrink-0"
      style={{
        perspective: "1000px",
      }}
      initial={animation.initial}
      whileHover={animation.hover}
      transition={animation.transition}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
    >
      {/* Background Image with Parallax Effect */}
      <motion.img
        src={displayImage}
        alt={title}
        className="w-full h-full object-cover"
        animate={
          isHovered && (mode === "teens" || mode === "adults")
            ? {
                scale: 1.1,
                x: mousePosition.x * 20,
                y: mousePosition.y * 20,
              }
            : { scale: 1, x: 0, y: 0 }
        }
        transition={{ duration: 0.3 }}
      />

      {/* Animated Glow Effect for Teens/Adults */}
      {(mode === "teens" || mode === "adults") && isHovered && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${
              50 + mousePosition.x * 20
            }% ${50 + mousePosition.y * 20}%, ${config.colors.primary}44, transparent)`,
          }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      )}

      {/* Overlay Gradient */}
      <div
        className="absolute inset-0 bg-gradient-to-t transition-opacity duration-300"
        style={{
          background: `linear-gradient(to top, ${config.colors.background}dd, transparent)`,
          opacity: isHovered ? 1 : 0.6,
        }}
      />

      {/* Content */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        {/* Top Badge */}
        {seasonNumber && (
          <motion.div
            className="inline-block px-3 py-1 rounded-full text-xs font-bold w-fit"
            style={{
              backgroundColor: `${config.colors.primary}33`,
              color: config.colors.primary,
              border: `1px solid ${config.colors.primary}`,
            }}
            animate={isHovered ? { scale: 1.1 } : { scale: 1 }}
          >
            Temporada {seasonNumber}
          </motion.div>
        )}

        {/* Bottom Content */}
        <motion.div
          animate={isHovered ? { y: -10 } : { y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="font-bold text-white text-lg mb-2 line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    style={{
                      color:
                        i < Math.floor(rating / 2)
                          ? config.colors.primary
                          : `${config.colors.primary}33`,
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs font-semibold" style={{color: config.colors.text}}>
                {rating.toFixed(1)}
              </span>
            </div>

            {/* Play Button */}
            <motion.button
              className="p-2 rounded-full transition-all"
              style={{
                backgroundColor: config.colors.primary,
                color: config.colors.background,
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play size={16} fill="currentColor" />
            </motion.button>
          </div>
        </motion.div>
      </div>

      {/* Neon Glow Border (for teens and adults modes) */}
      {(mode === "teens" || mode === "adults") && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            border: `2px solid ${config.colors.primary}`,
            boxShadow: `0 0 20px ${config.colors.primary}, inset 0 0 20px ${config.colors.primary}33`,
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Bounce Effect (for kids mode) */}
      {mode === "kids" && isHovered && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          style={{
            border: `3px dashed ${config.colors.secondary}`,
            boxShadow: `0 0 15px ${config.colors.secondary}`,
          }}
          animate={{
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 0.6,
            repeat: Infinity,
          }}
        />
      )}
    </motion.div>
  );
}
