import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import PageLayout from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { Loader2, Trophy, User as UserIcon, Calendar, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8000";

interface Score {
  id: number;
  quiz_type: string;
  score: number;
  timestamp: string;
}

interface UserProfile {
  id: number;
  username: string;
  email: string | null;
  created_at: string;
  scores: Score[];
}

const Profile = () => {
  const { user, logout, isLoading: authLoading } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [fetchLoading, setFetchLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/users/${user?.id}`);
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (error) {
      console.error("Failed to fetch profile", error);
    } finally {
      setFetchLoading(false);
    }
  };

  if (authLoading || fetchLoading) {
    return (
      <PageLayout>
        <div className="flex justify-center items-center h-[50vh]">
          <Loader2 className="animate-spin w-8 h-8 text-primary" />
        </div>
      </PageLayout>
    );
  }

  if (!profile) return null;

  // Calculate stats
  const totalQuizzes = profile.scores.length;
  const bestAlphabet = Math.max(0, ...profile.scores.filter(s => s.quiz_type === 'alphabet').map(s => s.score));
  const bestWord = Math.max(0, ...profile.scores.filter(s => s.quiz_type === 'words').map(s => s.score));

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Card */}
        <div className="glass-card p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center gap-6 animate-fade-in">
          <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center">
            <UserIcon className="w-12 h-12 text-primary" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-heading font-bold mb-2">{profile.username}</h1>
            <p className="text-muted-foreground flex items-center justify-center md:justify-start gap-2">
              <Calendar className="w-4 h-4" /> Joined {new Date(profile.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={logout}>Logout</Button>
            <Button
              style={{
                display: "none"
              }}
              variant="ghost"
              size="sm"
              className="text-muted-foreground text-xs"
              onClick={async () => {
                if (!user) return;
                setFetchLoading(true);
                try {
                  // Generate 3 random scores
                  for (let i = 0; i < 3; i++) {
                    const type = Math.random() > 0.5 ? "alphabet" : "words";
                    const score = Math.floor(Math.random() * 100);
                    await fetch(`${API_URL}/scores/?user_id=${user.id}`, {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ quiz_type: type, score: score })
                    });
                  }
                  await fetchProfile();
                } catch (e) {
                  console.error("Failed to add random data", e);
                }
              }}
            >
              Generate Random Data
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8 animate-fade-in">
          <div className="glass-card p-6 rounded-xl text-center">
            <Activity className="w-8 h-8 text-accent mx-auto mb-2" />
            <div className="text-3xl font-bold font-heading">{totalQuizzes}</div>
            <div className="text-sm text-muted-foreground">Quizzes Taken</div>
          </div>
          <div className="glass-card p-6 rounded-xl text-center">
            <Trophy className="w-8 h-8 text-success mx-auto mb-2" />
            <div className="text-3xl font-bold font-heading">{bestAlphabet}</div>
            <div className="text-sm text-muted-foreground">Best Alphabet Score</div>
          </div>
          <div className="glass-card p-6 rounded-xl text-center">
            <Trophy className="w-8 h-8 text-warning mx-auto mb-2" />
            <div className="text-3xl font-bold font-heading">{bestWord}</div>
            <div className="text-sm text-muted-foreground">Best Word Score</div>
          </div>
        </div>

        {/* Recent History */}
        <h2 className="text-2xl font-bold mb-4 font-heading">Recent Activity</h2>
        <div className="space-y-4">
          {profile.scores.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No quizzes taken yet.</div>
          ) : (
            profile.scores.slice().reverse().map((score) => (
              <div key={score.id} className="glass-card p-4 rounded-lg flex justify-between items-center animate-fade-in">
                <div>
                  <span className="font-bold capitalize">{score.quiz_type} Quiz</span>
                  <span className="text-sm text-muted-foreground block">
                    {new Date(score.timestamp).toLocaleDateString()} at {new Date(score.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-xl font-bold text-primary">
                  {score.score} pts
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
