import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Trophy, 
  Target, 
  Calendar, 
  TrendingUp, 
  Medal,
  BookOpen,
  Hand,
  Star
} from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data - in a real app, this would come from your backend/auth
const userData = {
  name: "Guest User",
  email: "guest@example.com",
  joinDate: "January 2025",
  streak: 5,
  totalPracticeTime: 12,
  lettersLearned: 18,
  wordsLearned: 8,
  quizzesTaken: 6,
  averageScore: 78,
};

const achievements = [
  { id: 1, title: "First Steps", description: "Complete your first lesson", icon: Star, unlocked: true },
  { id: 2, title: "Alphabet Master", description: "Learn all 26 letters", icon: Hand, unlocked: false, progress: 69 },
  { id: 3, title: "Quiz Champion", description: "Score 100% on a quiz", icon: Trophy, unlocked: false },
  { id: 4, title: "Consistent Learner", description: "7-day learning streak", icon: Calendar, unlocked: false, progress: 71 },
];

const recentActivity = [
  { date: "Today", action: "Practiced letters A-E", type: "practice" },
  { date: "Yesterday", action: "Completed quiz: 8/10", type: "quiz" },
  { date: "2 days ago", action: "Learned word: HELLO", type: "word" },
  { date: "3 days ago", action: "Practiced letters F-J", type: "practice" },
];

const Profile = () => {
  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column - Profile info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile card */}
            <div className="glass-card rounded-2xl p-6 text-center">
              <div className="w-24 h-24 rounded-full gradient-primary mx-auto mb-4 flex items-center justify-center">
                <User className="w-12 h-12 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-heading font-bold text-foreground">
                {userData.name}
              </h2>
              <p className="text-muted-foreground">{userData.email}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Member since {userData.joinDate}
              </p>
              <div className="mt-4 flex items-center justify-center gap-2 text-accent">
                <span className="text-2xl">🔥</span>
                <span className="font-heading font-bold text-lg">{userData.streak} day streak!</span>
              </div>
            </div>

            {/* Quick stats */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Your Stats
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Hand className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Letters Learned</span>
                  </div>
                  <span className="font-heading font-bold text-foreground">
                    {userData.lettersLearned}/26
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-secondary" />
                    </div>
                    <span className="text-sm text-muted-foreground">Words Learned</span>
                  </div>
                  <span className="font-heading font-bold text-foreground">
                    {userData.wordsLearned}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-success" />
                    </div>
                    <span className="text-sm text-muted-foreground">Quizzes Taken</span>
                  </div>
                  <span className="font-heading font-bold text-foreground">
                    {userData.quizzesTaken}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-accent-foreground" />
                    </div>
                    <span className="text-sm text-muted-foreground">Avg Quiz Score</span>
                  </div>
                  <span className="font-heading font-bold text-foreground">
                    {userData.averageScore}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - Achievements and activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Overall progress */}
            <div className="glass-card rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold text-foreground">
                  Learning Progress
                </h3>
                <span className="text-sm text-muted-foreground">
                  {Math.round((userData.lettersLearned / 26) * 100)}% Complete
                </span>
              </div>
              <Progress 
                value={(userData.lettersLearned / 26) * 100} 
                className="h-4 mb-4"
              />
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 26 }, (_, i) => String.fromCharCode(65 + i)).map((letter, i) => (
                  <div
                    key={letter}
                    className={cn(
                      "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors",
                      i < userData.lettersLearned
                        ? "bg-success/20 text-success"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Achievements
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {achievements.map((achievement) => {
                  const Icon = achievement.icon;
                  return (
                    <div
                      key={achievement.id}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all",
                        achievement.unlocked
                          ? "border-accent bg-accent/10"
                          : "border-border bg-muted/50 opacity-75"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={cn(
                            "w-12 h-12 rounded-xl flex items-center justify-center",
                            achievement.unlocked
                              ? "gradient-primary"
                              : "bg-muted"
                          )}
                        >
                          <Icon
                            className={cn(
                              "w-6 h-6",
                              achievement.unlocked
                                ? "text-primary-foreground"
                                : "text-muted-foreground"
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-heading font-semibold text-foreground">
                            {achievement.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {achievement.description}
                          </p>
                          {achievement.progress !== undefined && !achievement.unlocked && (
                            <div className="mt-2">
                              <Progress value={achievement.progress} className="h-1.5" />
                              <span className="text-xs text-muted-foreground">
                                {achievement.progress}%
                              </span>
                            </div>
                          )}
                        </div>
                        {achievement.unlocked && (
                          <Medal className="w-6 h-6 text-accent" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent activity */}
            <div className="glass-card rounded-2xl p-6">
              <h3 className="font-heading font-semibold text-foreground mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                {recentActivity.map((activity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div
                      className={cn(
                        "w-2 h-2 rounded-full",
                        activity.type === "practice"
                          ? "bg-primary"
                          : activity.type === "quiz"
                          ? "bg-success"
                          : "bg-secondary"
                      )}
                    />
                    <div className="flex-1">
                      <p className="text-foreground">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
