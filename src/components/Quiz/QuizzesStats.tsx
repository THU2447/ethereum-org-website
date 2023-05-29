import React, { useContext } from "react"
import {
  Box,
  Circle,
  Flex,
  Grid,
  GridItem,
  Icon,
  Progress,
  Stack,
  Text,
} from "@chakra-ui/react"
import { FaTwitter } from "react-icons/fa"
import { useI18next } from "gatsby-plugin-react-i18next"

import Button from "../Button"
import Translation from "../Translation"
import { TrophyIcon } from "../icons/quiz"

import { QuizzesHubContext } from "./context"

// Utils
import { getNumberOfCompletedQuizzes, getTotalQuizzesPoints } from "./utils"
import {
  isLangRightToLeft,
  getLocaleForNumberFormat,
} from "../../utils/translations"
import { Lang } from "../../utils/languages"

import { QuizShareStats } from "../../types"

import { ethereumBasicsQuizzes, usingEthereumQuizzes } from "../../data/quizzes"

// TODO: track event on matomo
const shareOnTwitter = ({ score, total }: QuizShareStats): void => {
  // if (!quizData || !window) return
  //   trackCustomEvent({
  //     eventCategory: "Quiz widget",
  //     eventAction: "Other",
  //     eventName: "Share results",
  //   })
  const url = "https://ethereum.org/quizzes"
  const hashtags = ["ethereumquiz", "ethereum", "quiz"]
  const tweet = `${encodeURI(
    `I took Ethereum quizzes on ethereum.org and overall scored ${score} out of ${total}! Try it yourself at ${url}`
  )}`

  window.open(
    `https://twitter.com/intent/tweet?text=${tweet}&hashtags=${hashtags}`
  )
}

const handleShare = ({ score, total }: QuizShareStats) =>
  shareOnTwitter({
    score,
    total,
  })

const QuizzesStats: React.FC = () => {
  const { language } = useI18next()
  const localeForQuizStats = getLocaleForNumberFormat(language as Lang)
  const isRightToLeft = isLangRightToLeft(language as Lang)
  const { score: userScore, completed, average } = useContext(QuizzesHubContext)
  const totalQuizzesNumber =
    ethereumBasicsQuizzes.length + usingEthereumQuizzes.length
  const TOTAL_QUIZZES_POINTS = getTotalQuizzesPoints()
  const numberOfCompletedQuizzes = getNumberOfCompletedQuizzes(
    JSON.parse(completed)
  )

  // Data from Matomo, manually updated
  const collectiveQuestionsAnswered = 100000
  const collectiveAverageScore = 67.4 / 100 // converted to fraction for percentage format
  const collectiveRetryRate = 15.6 / 100 // converted to fraction for percentage format

  const formatNumber = new Intl.NumberFormat(localeForQuizStats, {
    style: "decimal",
    minimumSignificantDigits: 2,
    maximumSignificantDigits: 3,
  })

  const formatPercent = new Intl.NumberFormat(localeForQuizStats, {
    style: "percent",
    minimumSignificantDigits: 2,
    maximumSignificantDigits: 3,
  })

  // formatted collective stats
  const formattedCollectiveQuestionsAnswered = formatNumber.format(
    collectiveQuestionsAnswered
  )
  // If language is RTL, more than indicator should go at start
  const textForCollectiveQuestions = isRightToLeft
    ? `+${formattedCollectiveQuestionsAnswered}`
    : `${formattedCollectiveQuestionsAnswered}+`

  const formattedCollectiveAverageScore = formatPercent.format(
    collectiveAverageScore
  )
  const formattedCollectiveRetryRate = formatPercent.format(collectiveRetryRate)
  const formattedUserAverageScore = formatPercent.format(average)

  return (
    <Box flex={1} order={{ base: 1, lg: 2 }} w="full">
      <Stack mt={{ base: 0, lg: 12 }} gap={{ base: 8, lg: 4 }}>
        {/* user stats */}
        <Grid
          gap={4}
          bg="ednBackground"
          borderRadius={{ base: "none", lg: "lg" }}
          border="none"
          p={{ base: 8, lg: 12 }}
          mb={-2}
        >
          <GridItem colSpan={{ base: 2, lg: 1 }} alignSelf="center" order={1}>
            <Text
              color="body"
              fontWeight="bold"
              fontSize="xl"
              margin={0}
              textAlign={{ base: "center", lg: "left" }}
            >
              <Translation id="your-total" />
            </Text>
          </GridItem>

          <GridItem
            colSpan={{ base: 2, lg: 1 }}
            justifySelf={{ base: "auto", lg: "end" }}
            alignSelf="center"
            order={{ base: 3, lg: 2 }}
          >
            <Button
              variant="outline-color"
              leftIcon={<Icon as={FaTwitter} />}
              onClick={() =>
                handleShare({ score: userScore, total: TOTAL_QUIZZES_POINTS })
              }
              w={{ base: "full", lg: "auto" }}
              mt={{ base: 2, lg: 0 }}
            >
              <Translation id="share-results" />
            </Button>
          </GridItem>

          <GridItem colSpan={2} order={{ base: 2, lg: 3 }}>
            <Stack gap={2}>
              <Flex
                justifyContent={{ base: "center", lg: "flex-start" }}
                alignItems="center"
              >
                <Circle size="64px" bg="primary" mr={4}>
                  <TrophyIcon color="neutral" w="35.62px" h="35.62px" />
                </Circle>

                <Text fontWeight="bold" fontSize="5xl" mb={0} color="body">
                  {userScore}
                  <Text as="span" color="bodyLight">
                    /{TOTAL_QUIZZES_POINTS}
                  </Text>
                </Text>
              </Flex>

              <Progress value={userScore} />

              <Flex direction={{ base: "column", lg: "row" }}>
                <Text mr={10} mb={0} mt={{ base: 2, lg: 0 }} color="bodyLight">
                  <Translation id="average-score" />{" "}
                  <Text as="span" color="body">
                    {formattedUserAverageScore}
                  </Text>
                </Text>

                <Text mb={0} color="bodyLight">
                  <Translation id="completed" />{" "}
                  <Text as="span" color="body">
                    {numberOfCompletedQuizzes}/{totalQuizzesNumber}
                  </Text>
                </Text>
              </Flex>
            </Stack>
          </GridItem>
        </Grid>

        {/* community stats */}
        <Flex
          direction="column"
          gap={6}
          justifyContent="space-between"
          bg="ednBackground"
          borderRadius={{ base: "none", lg: "lg" }}
          border="none"
          p={{ base: 8, lg: 12 }}
        >
          <Text fontWeight="bold" fontSize="xl" mb={0}>
            <Translation id="community-stats" />
          </Text>

          <Flex
            direction={{ base: "column", md: "row" }}
            gap={{ base: 6, md: 10 }}
          >
            <Stack>
              <Text mr={10} mb={-2} color="bodyLight">
                <Translation id="average-score" />
              </Text>
              {/* Data from Matomo, manually updated */}
              <Text color="body">{formattedCollectiveAverageScore}</Text>
            </Stack>

            <Stack>
              <Text mr={10} mb={-2} color="bodyLight">
                <Translation id="questions-answered" />
              </Text>

              {/* Data from Matomo, manually updated */}
              <Text color="body">{textForCollectiveQuestions}</Text>
            </Stack>

            <Stack>
              <Text mr={10} mb={-2} color="bodyLight">
                <Translation id="retry" />
              </Text>

              {/* Data from Matomo, manually updated */}
              <Text color="body">{formattedCollectiveRetryRate}</Text>
            </Stack>
          </Flex>
        </Flex>
      </Stack>
    </Box>
  )
}

export default QuizzesStats
