package ir.ac.sbu.evaluation.repository.review;

import ir.ac.sbu.evaluation.model.review.ProblemReview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProblemReviewRepository extends JpaRepository<ProblemReview, Long> {

}
